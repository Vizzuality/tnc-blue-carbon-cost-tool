# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: /home/elena/vizzuality/repos/tnc-blue-carbon-cost-tool/data/notebooks/../src/sequestration_credits_calculator.py
# Bytecode version: 3.12.0rc2 (3531)
# Source timestamp: 2024-10-23 09:24:43 UTC (1729675483)

class SequestrationCreditsCalculator:

    def __init__(self, project):
        """Initialize the SequestrationCreditsCalculator with a project object."""
        self.project = project
        if self.project.activity == 'Restoration':
            self.project_length = self.project.restoration_project_length
        else:
            self.project_length = self.project.conservation_project_length

    def calculate_est_credits_issued(self):
        """Calculate estimated credits issued."""
        est_credits_issued_plan = {year: 0 for year in range(-1, self.project.default_project_length + 1) if year != 0}
        net_emissions_reductions = self.calculate_net_emissions_reductions()
        for year, _ in est_credits_issued_plan.items():
            if year <= self.project_length:
                est_credits_issued_plan[year] = net_emissions_reductions[year] * (1 - self.project.buffer)
            else:
                est_credits_issued_plan[year] = 0
        return est_credits_issued_plan

    def calculate_net_emissions_reductions(self):
        """Calculate either the conservation or the restoration net emissions reductions"""
        net_emission_reductions_plan = {year: 0 for year in range(-1, self.project.default_project_length + 1) if year != 0}
        if self.project.activity == 'Conservation':
            net_emission_reductions_plan = self._calculate_conservation_emissions(net_emission_reductions_plan)
        if self.project.activity == 'Restoration':
            net_emission_reductions_plan = self._calculate_restoration_emissions(net_emission_reductions_plan)
        return net_emission_reductions_plan

    def _calculate_conservation_emissions(self, net_emission_reductions_plan):
        """Calculate emissions reductions for conservation projects."""
        baseline_emissions = self.calculate_baseline_emissions()
        for year, _ in net_emission_reductions_plan.items():
            if year <= self.project_length:
                if year == -1:
                    net_emission_reductions_plan[year] = 0
                else:
                    net_emission_reductions_plan[year] = baseline_emissions[year]
            else:
                net_emission_reductions_plan[year] = 0
        return net_emission_reductions_plan

    def _calculate_restoration_emissions(self, net_emission_reductions_plan):
        """Calculate emissions reductions for restoration projects."""
        area_restored_or_conserved_plan = self.calculate_area_restored_or_conserved()
        sequestration_rate = self.project.sequestration_rate
        for year, _ in net_emission_reductions_plan.items():
            if year <= self.project_length:
                if year == -1:
                    net_emission_reductions_plan[year] = 0
                elif self.project.restoration_activity == 'Planting':
                    net_emission_reductions_plan[year] = self._calculate_planting_emissions(area_restored_or_conserved_plan, sequestration_rate, year)
                else:
                    net_emission_reductions_plan[year] = float(area_restored_or_conserved_plan[year - 1]) * float(sequestration_rate)
            else:
                net_emission_reductions_plan[year] = 0
        return net_emission_reductions_plan

    def _calculate_planting_emissions(self, area_restored_or_conserved_plan, sequestration_rate, year):
        """Calculate planting-based emissions reductions for restoration projects."""
        planting_success_rate = self.project.planting_success_rate
        if year == 1:
            return float(area_restored_or_conserved_plan[year - 2]) * float(sequestration_rate) * float(planting_success_rate)
        return float(area_restored_or_conserved_plan[year - 1]) * float(sequestration_rate) * float(planting_success_rate)

    def calculate_baseline_emissions(self):
        """SEQUESTRATION + CREDITS: Calculate the baseline emissions for the project.
        NOTE: For conservation projects only.
        NOTE: Double check with client why here we are using sequestration rate
        if this is for conservation projects."""
        if self.project.activity != 'Conservation':
            raise ValueError('Baseline emissions can only be calculated for conservation projects.')
        sequestration_rate_tier_1 = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'tier_1_sequestration_rate'].values[0]
        if self.project.emission_factor_used == 'Tier 1 - Global emission factor':
            emission_factor = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'tier_1_emission_factor'].values[0]
        elif self.project.emission_factor_used == 'Tier 2 - Country-specific emission factor':
            emission_factor_agb = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'emission_factor_AGB'].values[0]
            emission_factor_soc = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'emission_factor_SOC'].values[0]
        else:
            emission_factor_agb = self.project.emission_factor_AGB
            emission_factor_soc = self.project.emission_factor_SOC
        baseline_emission_plan = {year: 0 for year in range(1, self.project.default_project_length + 1) if year != 0}
        cumulative_loss = self.calculate_cumulative_loss_rate()
        cumulative_loss_rate_incorporating_soc = self.calculate_cumulative_loss_rate_incorporating_soc_release_time()
        annual_avoided_loss = self.calculate_annual_avoided_loss()
        for year, value in baseline_emission_plan.items():
            if year <= self.project_length:
                if self.project.emission_factor_used != 'Tier 1 - Global emission factor':
                    value = emission_factor_agb * annual_avoided_loss[year] + cumulative_loss_rate_incorporating_soc[year] * emission_factor_soc + sequestration_rate_tier_1 * cumulative_loss[year]
                else:
                    value = cumulative_loss[year] * emission_factor + sequestration_rate_tier_1 * cumulative_loss[year]
                baseline_emission_plan[year] = value
            else:
                baseline_emission_plan[year] = 0
        return baseline_emission_plan

    def calculate_area_restored_or_conserved(self):
        """SEQUESTRATION + CREDITS: Utility function to calculate area restored or conserved needed
        in the calculation of the CAPEX Implementation cost."""
        cumulative_ha_restored_in_year = {year: 0 for year in range(-1, self.project.default_project_length + 1) if year != 0}
        for year, _ in cumulative_ha_restored_in_year.items():
            if year > self.project_length:
                cumulative_ha_restored_in_year[year] = 0
            elif self.project.activity == 'Restoration':
                if self.project.restoration_rate < self.project.project_size_ha:
                    cumulative_ha_restored_in_year[year] = self.project.restoration_rate
                else:
                    cumulative_ha_restored_in_year[year] = self.project.project_size_ha
            elif self.project.project_size_ha < self.project.project_size_ha:
                cumulative_ha_restored_in_year[year] = self.project.project_size_ha
            else:
                cumulative_ha_restored_in_year[year] = self.project.project_size_ha
        return cumulative_ha_restored_in_year

    def calculate_cumulative_loss_rate(self):
        """SEQUESTRATION + CREDITS: Calculate the cumulative loss rate for the project.
        NOTE: For conservation projects only."""
        if self.project.activity != 'Conservation':
            raise ValueError('Cumulative loss rate can only be calculated for conservation projects.')
        cumulative_loss_rate = {year: 0 for year in range(1, self.project.default_project_length + 1)}
        annual_avoided_loss = self.calculate_annual_avoided_loss()
        for year, _ in cumulative_loss_rate.items():
            if year <= self.project_length:
                if year == 1:
                    cumulative_loss_rate[year] = annual_avoided_loss[year]
                else:
                    cumulative_loss_rate[year] = annual_avoided_loss[year] + cumulative_loss_rate[year - 1]
            else:
                cumulative_loss_rate[year] = 0
        return cumulative_loss_rate

    def calculate_cumulative_loss_rate_incorporating_soc_release_time(self):
        """SEQUESTRATION + CREDITS: Calculate the cumulative loss rate for the project incorporating
         SOC release time.
        NOTE: For conservation projects only."""
        if self.project.activity != 'Conservation':
            raise ValueError('Cumulative loss rate can only be calculated for conservation projects.')
        cumulative_loss_rate_incorporating_soc = {year: 0 for year in range(1, self.project.default_project_length + 1)}
        cumulative_loss = self.calculate_cumulative_loss_rate()
        for year, _ in cumulative_loss_rate_incorporating_soc.items():
            if year <= self.project_length:
                if year > self.project.soil_organic_carbon_release_length:
                    offset_value = cumulative_loss[year - self.project.soil_organic_carbon_release_length]
                    cumulative_loss_rate_incorporating_soc[year] = cumulative_loss[year] - offset_value
                else:
                    cumulative_loss_rate_incorporating_soc[year] = cumulative_loss[year]
            else:
                cumulative_loss_rate_incorporating_soc[year] = 0
        return cumulative_loss_rate_incorporating_soc

    def calculate_annual_avoided_loss(self):
        """SEQUESTRATION + CREDITS: Calculate the annual avoided loss for the project.
        NOTE: For conservation projects only."""
        if self.project.activity != 'Conservation':
            raise ValueError('Avoided loss can only be calculated for conservation projects.')
        projected_loss = self.calculate_projected_loss()
        annual_avoided_loss = {year: 0 for year in range(1, self.project.default_project_length + 1)}
        for year, _ in annual_avoided_loss.items():
            if year <= self.project_length:
                if year == 1:
                    annual_avoided_loss[year] = (projected_loss[year] - projected_loss[-1]) * -1
                else:
                    annual_avoided_loss[year] = (projected_loss[year] - projected_loss[year - 1]) * -1
            else:
                annual_avoided_loss[year] = 0
        return annual_avoided_loss

    def calculate_projected_loss(self):
        """SEQUESTRATION + CREDITS: Calculate the projected loss for the project.
        NOTE: For conservation projects only."""
        if self.project.activity != 'Conservation':
            raise ValueError('Projected loss can only be calculated for conservation projects.')
        loss_rate = self.project.loss_rate
        project_size_ha = self.project.project_size_ha
        annual_projected_loss = {year: 0 for year in range(-1, self.project.default_project_length + 1) if year != 0}
        for year, _ in annual_projected_loss.items():
            if year <= self.project_length:
                if year == -1:
                    annual_projected_loss[year] = project_size_ha
                else:
                    annual_projected_loss[year] = project_size_ha * (1 + loss_rate) ** year
            else:
                annual_projected_loss[year] = 0
        return annual_projected_loss
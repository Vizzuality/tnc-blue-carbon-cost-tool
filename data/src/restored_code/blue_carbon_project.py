# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: /home/elena/vizzuality/repos/tnc-blue-carbon-cost-tool/data/notebooks/../src/blue_carbon_project.py
# Bytecode version: 3.12.0rc2 (3531)
# Source timestamp: 2024-10-23 09:26:09 UTC (1729675569)

import logging
from data.src.restored_code.utils import get_value_from_master_table, initialize_restoration_plan, load_country_code


class BlueCarbonProject:
    VERIFICATION_FREQUENCY = 5
    BASELINE_REASSESSMENT_FREQUENCY = 10
    DISCOUNT_RATE = 0.04
    CARBON_PRICE_INCREASE = 0.015
    ANNUAL_COST_INCREASE = 0
    BUFFER = 0.2
    SOIL_ORGANIC_CARBON_RELEASE_LENGTH = 10
    RESTORATION_STARTING_POINT_SCALING = 500
    CONSERVATION_STARTING_POINT_SCALING = 20000
    RESTORATION_PROJECT_LENGTH = 20
    CONSERVATION_PROJECT_LENGTH = 20
    RESTORATION_RATE = 250
    DEFAULT_PROJECT_LENGTH = 40
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass

    def __init__(self, activity, ecosystem, country, master_table, base_size, base_increase, carbon_price=30,
                 carbon_revenues_to_cover='Opex', project_size_ha=0, restoration_activity=None,
                 sequestration_rate_used=None, project_specific_sequestration_rate=None, planting_success_rate=0.8,
                 loss_rate_used=None, project_specific_loss_rate=None, emission_factor_used=None,
                 tier_3_project_specific_emission=None, tier_3_project_specific_emission_one_factor=None,
                 tier_3_emission_factor_agb=None, tier_3_emission_factor_soc=None):
        """Initialize a Blue Carbon Project with default values and user inputs."""  # inserted
        self.logger = logging.getLogger(__name__)
        self.activity = activity
        self.ecosystem = ecosystem
        self.master_table = master_table
        self.base_size = base_size
        self.base_increase = base_increase
        self.country = country
        self.carbon_price = carbon_price
        self.carbon_revenues_to_cover = carbon_revenues_to_cover
        self.project_size_ha = project_size_ha
        self.country_code = load_country_code(self.master_table, self.country)
        self.restoration_activity = restoration_activity
        self.sequestration_rate_used = sequestration_rate_used
        self.project_specific_sequestration_rate = project_specific_sequestration_rate
        self.planting_success_rate = planting_success_rate
        self.loss_rate_used = loss_rate_used
        self.project_specific_loss_rate = project_specific_loss_rate
        self.emission_factor_used = emission_factor_used
        self.tier_3_project_specific_emission = tier_3_project_specific_emission
        self.tier_3_project_specific_emission_one_factor = tier_3_project_specific_emission_one_factor
        self.tier_3_emission_factor_agb = tier_3_emission_factor_agb
        self.tier_3_emission_factor_soc = tier_3_emission_factor_soc
        self.verification_frequency = BlueCarbonProject.VERIFICATION_FREQUENCY
        self.baseline_reassessment_frequency = BlueCarbonProject.BASELINE_REASSESSMENT_FREQUENCY
        self.discount_rate = BlueCarbonProject.DISCOUNT_RATE
        self.carbon_price_increase = BlueCarbonProject.CARBON_PRICE_INCREASE
        self.annual_cost_increase = BlueCarbonProject.ANNUAL_COST_INCREASE
        self.buffer = BlueCarbonProject.BUFFER
        self.soil_organic_carbon_release_length = 10
        if self.activity == 'Restoration':
            self.starting_point_scaling = BlueCarbonProject.RESTORATION_STARTING_POINT_SCALING
        else:  # inserted
            if self.activity == 'Conservation':
                self.starting_point_scaling = BlueCarbonProject.CONSERVATION_STARTING_POINT_SCALING
        self.conservation_project_length = BlueCarbonProject.CONSERVATION_PROJECT_LENGTH
        self.restoration_project_length = BlueCarbonProject.RESTORATION_PROJECT_LENGTH
        self.restoration_rate = BlueCarbonProject.RESTORATION_RATE
        self.default_project_length = BlueCarbonProject.DEFAULT_PROJECT_LENGTH
        self.initialize_cost_inputs()
        self.carbon_revenues_will_not_cover = 'Capex' if self.carbon_revenues_to_cover == 'Opex' else 'None'
        self.calculate_project_parameters()
        self.restoration_plan = initialize_restoration_plan()

    def get_project_parameters(self):
        if self.activity == 'Restoration':
            additional_parameters = {
                'Activity type - Restoration': self.restoration_activity,
                'Sequestration rate used': self.sequestration_rate_used,
                f'{self.sequestration_rate_used}': float(self.project_specific_sequestration_rate)
                if self.sequestration_rate_used == 'Tier 3 - Project-specific rate' else float(self.sequestration_rate),
                'Planting Success Rate (prc)': self.planting_success_rate * 100
                if self.restoration_activity == 'Planting' else None
            }
            additional_assumptions = {
                'Restoration project length (yr)': self.restoration_project_length,
                'Restoration rate (ha/yr)': self.restoration_rate
            }
        else:
            additional_parameters = {
                'Loss rate used': self.loss_rate_used,
                f'{self.loss_rate_used}': self.project_specific_loss_rate
                if self.loss_rate_used == 'Project-specific' else self.loss_rate,
                'Emission factor used': self.emission_factor_used,
                'Global emission factor': float(
                    self.emission_factor) if self.emission_factor_used == 'Tier 1 - Global emission factor' else 'Country-specific emission factors',
                'Tier 3 - Project-specific emissions': float(
                    self.emission_factor) if self.tier_3_project_specific_emission == 'One emission factor' else 'Tier 3 - AGB and SOC separately',
                'Emission Factor AGB': float(
                    self.emission_factor_AGB) if self.tier_3_project_specific_emission == 'AGB and SOC separately' else None,
                'Emission Factor SOC': float(
                    self.emission_factor_SOC) if self.tier_3_project_specific_emission == 'AGB and SOC separately' else None
            }
            additional_assumptions = {'Conservation project length (yr)': self.conservation_project_length}
        return {
            'Activity': {
                'activity': self.activity,
                'Ecosystem': self.ecosystem,
                'Country': self.country,
                'Country code': self.country_code,
                'Project size (ha)': self.project_size_ha,
                'Initial carbon price assumption ($)': self.carbon_price,
                'Carbon revenues to cover': self.carbon_revenues_to_cover,
                'Carbon revenues will not cover': self.carbon_revenues_will_not_cover,
                'Discount rate (%)': self.discount_rate * 100,
                'Verification frequency (years)': self.verification_frequency,
                'Carbon price increase (%)': self.carbon_price_increase * 100,
                'Buffer (%)': self.buffer * 100,
            },
            'Additional Parameters': additional_parameters,
            'Additional Assumptions': additional_assumptions
        }

    def set_additional_assumptions(self, **kwargs):
        self.verification_frequency = kwargs.get('verification_frequency', BlueCarbonProject.VERIFICATION_FREQUENCY)
        self.discount_rate = kwargs.get('discount_rate', BlueCarbonProject.DISCOUNT_RATE)
        self.carbon_price_increase = kwargs.get('carbon_price_increase', BlueCarbonProject.CARBON_PRICE_INCREASE)
        self.buffer = kwargs.get('buffer', BlueCarbonProject.BUFFER)
        self.baseline_reassessment_frequency = kwargs.get('baseline_reassessment_frequency',
                                                          BlueCarbonProject.BASELINE_REASSESSMENT_FREQUENCY)
        if self.activity == 'Conservation':
            self.conservation_project_length = kwargs.get('conservation_project_length',
                                                          BlueCarbonProject.CONSERVATION_PROJECT_LENGTH)
        else:  # inserted
            if self.activity == 'Restoration':
                self.restoration_project_length = kwargs.get('restoration_project_length',
                                                             BlueCarbonProject.RESTORATION_PROJECT_LENGTH)
                if self.ecosystem == 'Mangrove':
                    self.restoration_rate = kwargs.get('restoration_rate', BlueCarbonProject.RESTORATION_RATE)
                else:  # inserted
                    if self.ecosystem == 'Seagrass':
                        self.restoration_rate = kwargs.get('restoration_rate', BlueCarbonProject.RESTORATION_RATE)
                    else:  # inserted
                        if self.ecosystem == 'Salt marsh':
                            self.restoration_rate = kwargs.get('restoration_rate', BlueCarbonProject.RESTORATION_RATE)

    def calculate_project_parameters(self):
        if self.activity == 'Restoration':
            self.get_sequestration_rate()
            self.get_planting_success_rate()
        else:  # inserted
            if self.activity == 'Conservation':
                self.get_loss_rate()
                self.get_emission_factor()

    def get_sequestration_rate(self):
        if self.activity != 'Restoration':
            raise ValueError('Sequestration rate can only be calculated for restoration projects.')
        if self.sequestration_rate_used == 'Tier 1 - IPCC default value':
            self.sequestration_rate = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem,
                                                                  'tier_1_sequestration_rate')
        else:  # inserted
            if self.sequestration_rate_used == 'Tier 2 - Country-specific rate':
                if self.ecosystem == 'Mangrove':
                    self.sequestration_rate = get_value_from_master_table(self.master_table, self.country_code,
                                                                          self.ecosystem, 'tier_2_sequestration_rate')
                else:  # inserted
                    raise ValueError('Country-specific sequestration rate is not available for this ecosystem.')
            else:  # inserted
                if self.sequestration_rate_used == 'Tier 3 - Project-specific rate':
                    if self.project_specific_sequestration_rate is not None:
                        self.sequestration_rate = self.project_specific_sequestration_rate
                    else:  # inserted
                        raise ValueError(
                            'Project-specific sequestration rate must be provided when\n                     \'Tier 3 '
                            '- Project-specific rate\' is selected.')

    def get_planting_success_rate(self):
        if self.activity != 'Restoration':
            raise ValueError('Planting success rate can only be calculated for restoration projects.')
        if self.restoration_activity == 'Planting' and self.planting_success_rate is None:
            raise ValueError('Planting success rate must be provided when \'Planting\' is selected.')

    def get_loss_rate(self):
        if self.activity != 'Conservation':
            raise ValueError('Loss rate can only be calculated for conservation projects.')
        if self.loss_rate_used == 'National average':
            self.loss_rate = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem,
                                                         'ecosystem_loss_rate')
        else:  # inserted
            if self.project_specific_loss_rate is not None:
                self.loss_rate = self.project_specific_loss_rate
            else:  # inserted
                raise ValueError(
                    'Project-specific loss rate must be provided\n                    when \'project-specific\' is '
                    'selected.')

    def get_emission_factor(self):
        if self.activity != 'Conservation':
            raise ValueError('Emission factor can only be calculated for conservation projects.')
        if self.emission_factor_used == 'Tier 1 - Global emission factor':
            self.emission_factor = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem,
                                                               'tier_1_emission_factor')
        else:  # inserted
            if self.emission_factor_used == 'Tier 2 - Country-specific emission factor':
                self.emission_factor_AGB = get_value_from_master_table(self.master_table, self.country_code,
                                                                       self.ecosystem, 'emission_factor_AGB')
                self.emission_factor_SOC = get_value_from_master_table(self.master_table, self.country_code,
                                                                       self.ecosystem, 'emission_factor_SOC')
            else:  # inserted
                if self.emission_factor_used == 'Tier 3 - Project specific emission factor':
                    if self.tier_3_project_specific_emission == 'One emission factor':
                        self.emission_factor = self.tier_3_project_specific_emission_one_factor
                        self.emission_factor_AGB = 0
                        self.emission_factor_SOC = 0
                    else:  # inserted
                        if self.tier_3_project_specific_emission == 'AGB and SOC separately':
                            self.emission_factor_AGB = self.tier_3_emission_factor_agb
                            self.emission_factor_SOC = self.tier_3_emission_factor_soc
                            self.logger.info(
                                f'Emission Factor AGB: {self.tier_3_emission_factor_agb},\n                     SOC: {self.tier_3_emission_factor_soc}')
                        else:  # inserted
                            raise ValueError(
                                'Tier 3 project specific emission factor or AGB & SOC values must be provided\n       '
                                '             when \'Tier 3 - Project specific emission factor\' is selected.')

    def override_cost_input(self, **kwargs):
        cost_items = {'feasibility_analysis': 'feasibility_analysis',
                      'conservation_planning_and_admin': 'conservation_planning_and_admin',
                      'data_collection_and_field_cost': 'data_collection_and_field_cost',
                      'community_representation': 'community_representation',
                      'blue_carbon_project_planning': 'blue_carbon_project_planning',
                      'establishing_carbon_rights': 'establishing_carbon_rights', 'validation': 'validation',
                      'implementation_labor': 'implementation_labor', 'monitoring': 'monitoring',
                      'maintenance': 'maintenance', 'community_benefit_sharing_fund': 'community_benefit_sharing_fund',
                      'carbon_standard_fees': 'carbon standard_fees', 'baseline_reassessment': 'baseline_reassessment',
                      'MRV': 'MRV', 'long_term_project_operating': 'long_term_project_operating_cost',
                      'financing_cost': 'financing_cost'}
        for key, column in cost_items.items():
            if key in kwargs and kwargs[key] is not None:
                setattr(self, key, kwargs[key])
            else:  # inserted
                if key == 'implementation_labor':
                    if self.activity != 'Restoration':
                        setattr(self, key, 0)
                    else:  # inserted
                        if self.restoration_activity == 'Planting':
                            setattr(self, key, self.master_table[
                                (self.master_table['country_code'] == self.country_code) & (
                                            self.master_table['ecosystem'] == self.ecosystem)][
                                'implementation_labor_planting'].values[0])
                        else:  # inserted
                            if self.restoration_activity == 'Hybrid':
                                setattr(self, key, self.master_table[
                                    (self.master_table['country_code'] == self.country_code) & (
                                                self.master_table['ecosystem'] == self.ecosystem)][
                                    'implementation_labor_hybrid'].values[0])
                            else:  # inserted
                                if self.restoration_activity == 'Hydrology':
                                    setattr(self, key, self.master_table[
                                        (self.master_table['country_code'] == self.country_code) & (
                                                    self.master_table['ecosystem'] == self.ecosystem)][
                                        'implementation_labor_hydrology'].values[0])
                else:  # inserted
                    setattr(self, key, self.master_table[(self.master_table['country_code'] == self.country_code) & (
                                self.master_table['ecosystem'] == self.ecosystem)][column].values[0])

    def update_restoration_plan(self, **kwargs):
        """\n        Update the restoration plan with user-defined values for specific years.\n        """  # inserted
        for year, hectares in kwargs.items():
            if year in self.restoration_plan:
                self.restoration_plan[year] = hectares
            else:  # inserted
                self.logger.info(f'Year {year} is not part of the restoration plan.')

    def calculate_total_restoration(self):
        """\n        Calculate the total hectares restored over the plan period.\n        """  # inserted
        total_restored = sum(self.restoration_plan.values())
        return total_restored

    def print_restoration_plan(self):
        """\n        Print the restoration plan showing annual restoration by year and the total.\n        """  # inserted
        for year, hectares in self.restoration_plan.items():
            self.logger.info(f'Year {year}: {hectares} ha')

    def initialize_cost_inputs(self):
        cost_items = {'feasibility_analysis': 'feasibility_analysis',
                      'conservation_planning_and_admin': 'conservation_planning_and_admin',
                      'data_collection_and_field_cost': 'data_collection_and_field_cost',
                      'community_representation': 'community_representation',
                      'blue_carbon_project_planning': 'blue_carbon_project_planning',
                      'establishing_carbon_rights': 'establishing_carbon_rights', 'validation': 'validation',
                      'implementation_labor': 'implementation_labor', 'monitoring': 'monitoring',
                      'maintenance': 'maintenance', 'community_benefit_sharing_fund': 'community_benefit_sharing_fund',
                      'carbon_standard_fees': 'carbon standard_fees', 'baseline_reassessment': 'baseline_reassessment',
                      'MRV': 'MRV', 'long_term_project_operating': 'long_term_project_operating_cost',
                      'financing_cost': 'financing_cost'}
        for key, column in cost_items.items():
            if key == 'implementation_labor':
                if self.activity == 'Restoration':
                    if self.restoration_activity == 'Planting':
                        value = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem,
                                                            'implementation_labor_planting')
                    else:  # inserted
                        if self.restoration_activity == 'Hybrid':
                            value = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem,
                                                                'implementation_labor_hybrid')
                        else:  # inserted
                            if self.restoration_activity == 'Hydrology':
                                value = get_value_from_master_table(self.master_table, self.country_code,
                                                                    self.ecosystem, 'implementation_labor_hydrology')
                            else:  # inserted
                                value = 0
                else:  # inserted
                    value = 0
            else:  # inserted
                value = get_value_from_master_table(self.master_table, self.country_code, self.ecosystem, column)
            setattr(self, key, value)

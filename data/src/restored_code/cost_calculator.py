import pandas as pd
import matplotlib.pyplot as plt
from data.src.restored_code.revenue_profit_calculator import RevenueProfitCalculator
from data.src.restored_code.sequestration_credits_calculator import SequestrationCreditsCalculator
from data.src.restored_code.utils import aggregate_costs, calculate_cost_plan, calculate_funding_gap, calculate_irr, calculate_npv, create_simple_plan, find_first_zero_value

class CostCalculator:
    def __init__(self, project):
        """Initialize the CostCalculator with a project object."""
        self.project = project
        self.revenue_profit_calculator = RevenueProfitCalculator(self.project)
        self.sequestration_credits_calculator = SequestrationCreditsCalculator(self.project)
        self.project_length = self.project.restoration_project_length if self.project.activity == 'Restoration' else self.project.conservation_project_length
        self.capex_total_cost_plan = {i: 0 for i in range(-4, self.project.default_project_length + 1) if i != 0}
        self.opex_total_cost_plan = {i: 0 for i in range(-4, self.project.default_project_length + 1) if i != 0}
        self.capex_cost_plan = self.calculate_capex_total()
        self.total_capex = sum(self.capex_cost_plan.values())
        self.total_capex_NPV = calculate_npv(self.capex_cost_plan, self.project.discount_rate)
        self.opex_cost_plan = self.calculate_opex_total()
        self.total_opex = sum(self.opex_cost_plan.values())
        self.total_opex_NPV = calculate_npv(self.opex_cost_plan, self.project.discount_rate)
        self.total_NPV = self.total_capex_NPV + self.total_opex_NPV
        self.estimated_revenue_plan = self.revenue_profit_calculator.calculate_est_revenue()
        self.total_revenue = sum(self.estimated_revenue_plan.values())
        self.total_revenue_NPV = calculate_npv(self.estimated_revenue_plan, self.project.discount_rate)
        self.total_credits_plan = self.sequestration_credits_calculator.calculate_est_credits_issued()
        self.credits_issued = sum(self.total_credits_plan.values())
        self.cost_per_tCO2e = self.total_NPV / self.credits_issued
        self.cost_per_ha = self.total_NPV / self.project.project_size_ha
        if self.project.carbon_revenues_to_cover == 'Opex':
            self.NPV_covering_cost = self.total_revenue_NPV - self.total_opex_NPV
        else:
            self.NPV_covering_cost = self.total_revenue_NPV - self.total_NPV
        self.financing_cost = float(self.project.financing_cost) * float(self.total_capex)
        if self.NPV_covering_cost < 0:
            self.funding_gap_NPV = -self.NPV_covering_cost
        else:
            self.funding_gap_NPV = 0
        self.funding_gap_per_tco2_NPV = self.funding_gap_NPV / self.credits_issued
        self.community_benefit_sharing_fund_plan = self.calculate_cummunity_benefit_sharing_fund()
        self.total_community_benefit_sharing_fund_NPV = calculate_npv(self.community_benefit_sharing_fund_plan, self.project.discount_rate)
        self.community_benefit_sharing_fund = self.total_community_benefit_sharing_fund_NPV / self.total_revenue_NPV
        reference_npv = self.total_opex_NPV if self.project.carbon_revenues_to_cover == 'Opex' else self.total_NPV
        self.funding_gap = calculate_funding_gap(reference_npv, self.total_revenue_NPV)
        self.IRR_opex = calculate_irr(self.revenue_profit_calculator.calculate_annual_net_cash_flow(self.capex_total_cost_plan, self.opex_total_cost_plan), self.revenue_profit_calculator.calculate_annual_net_income(self.opex_total_cost_plan), use_capex=False)
        self.IRR_total_cost = calculate_irr(self.revenue_profit_calculator.calculate_annual_net_cash_flow(self.capex_total_cost_plan, self.opex_total_cost_plan), self.revenue_profit_calculator.calculate_annual_net_income(self.opex_total_cost_plan), use_capex=True)
        self.proforma = self.get_yearly_cost_breakdown()

    def calculate_capex_total(self):
        cost_functions = [
            self.calculate_feasibility_analysis_cost,
            self.calculate_conservation_planning_and_admin,
            self.calculate_data_collection_and_field_cost,
            self.calculate_community_representation,
            self.calculate_blue_carbon_project_planning,
            self.calculate_establishing_carbon_rights,
            self.calculate_validation,
            self.calculate_implementation_labor
        ]
        for cost_func in cost_functions:
            cost_plan = cost_func()
            aggregate_costs(cost_plan, self.capex_total_cost_plan)
        return self.capex_total_cost_plan

    def calculate_opex_total(self):
        cost_functions = [
            self.calculate_monitoring,
            self.calculate_maintenance,
            self.calculate_cummunity_benefit_sharing_fund,
            self.calculate_carbon_standard_fees,
            self.calculate_baseline_reassessment,
            self.calculate_mrv,
            self.calculate_long_term_project_operating
        ]
        for cost_func in cost_functions:
            try:
                cost_plan = cost_func()
                aggregate_costs(cost_plan, self.opex_total_cost_plan)
            except Exception:
                print(f'Error calculating {cost_func.__name__}')
                a = 1
        return self.opex_total_cost_plan

    def calculate_feasibility_analysis_cost(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'feasibility_analysis', self.project.feasibility_analysis, self.project.activity, self.project.ecosystem)
        feasibility_analysis_cost_plan = create_simple_plan(total_base_cost, years=[-4])
        return feasibility_analysis_cost_plan

    def calculate_conservation_planning_and_admin(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'conservation_planning_and_admin', self.project.conservation_planning_and_admin, self.project.activity, self.project.ecosystem)
        conservation_cost_plan = create_simple_plan(total_base_cost, years=[-4, -3, -2, -1])
        return conservation_cost_plan

    def calculate_data_collection_and_field_cost(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'data_collection_and_field_cost', self.project.data_collection_and_field_cost, self.project.activity, self.project.ecosystem)
        data_collection_cost_plan = create_simple_plan(total_base_cost, years=[-4, -3, -2])
        return data_collection_cost_plan

    def calculate_community_representation(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'community_representation', self.project.community_representation, self.project.activity, self.project.ecosystem)
        project_development_type = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'other_community_cash_flow'].values[0]
        initial_cost = total_base_cost if project_development_type == 'Development' else 0
        community_rep_cost_plan = create_simple_plan(total_base_cost, years=[-4, -3, -2, -1])
        community_rep_cost_plan[-4] = initial_cost
        return community_rep_cost_plan

    def calculate_blue_carbon_project_planning(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'blue_carbon_project_planning', self.project.blue_carbon_project_planning, self.project.activity, self.project.ecosystem)
        blue_carbon_plan = create_simple_plan(total_base_cost, years=[-1])
        return blue_carbon_plan

    def calculate_establishing_carbon_rights(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'establishing_carbon_rights', self.project.establishing_carbon_rights, self.project.activity, self.project.ecosystem)
        carbon_rights_plan = create_simple_plan(total_base_cost, years=[-3, -2, -1])
        return carbon_rights_plan

    def calculate_validation(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'validation', self.project.validation, self.project.activity, self.project.ecosystem)
        validation_plan = create_simple_plan(total_base_cost, years=[-1])
        return validation_plan

    def calculate_implementation_labor(self):
        base_cost = self.project.implementation_labor if self.project.activity == 'Restoration' else 0
        area_restored_or_conserved_plan = self.sequestration_credits_calculator.calculate_area_restored_or_conserved()
        implementation_labor_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        for year in range(1, self.project_length + 1):
            labor_cost = base_cost * (area_restored_or_conserved_plan.get(year, 0) - area_restored_or_conserved_plan.get(year - 1, 0))
            implementation_labor_cost_plan[year] = labor_cost
        return implementation_labor_cost_plan

    def calculate_monitoring(self):
        total_base_cost = calculate_cost_plan(self.project.base_size, self.project.base_increase, self.project.project_size_ha, 'monitoring', self.project.monitoring, self.project.activity, self.project.ecosystem)
        monitoring_cost_plan = {year: total_base_cost if 1 <= year <= self.project_length else 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        return monitoring_cost_plan

    def calculate_maintenance(self):
        base_cost = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'maintenance'].values[0]
        maintenance_duration = self.project.master_table.loc[(self.project.master_table['country_code'] == self.project.country_code) & (self.project.master_table['ecosystem'] == self.project.ecosystem), 'maintenance_duration'].values[0]
        implementation_labor_cost_plan = self.calculate_implementation_labor()
        first_zero_value = find_first_zero_value(implementation_labor_cost_plan)
        maintenance_end_year = first_zero_value + maintenance_duration - 1 if self.project.project_size_ha / self.project.restoration_rate <= 20 else self.project.default_project_length + maintenance_duration
        maintenance_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        ## TODO: !!! Parsing to int as maintenance_end_year is a np.int64 value here
        for year in range(1, int(maintenance_end_year) + 1):
            if year <= maintenance_end_year:
                maintenance_cost_plan[year] = base_cost
        return maintenance_cost_plan

    def calculate_cummunity_benefit_sharing_fund(self):
        base_cost = self.project.community_benefit_sharing_fund
        community_benefit_sharing_fund_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        estimated_revenue = self.revenue_profit_calculator.calculate_est_revenue()
        for year, _ in community_benefit_sharing_fund_cost_plan.items():
            if year <= self.project_length:
                community_benefit_sharing_fund_cost_plan[year] = estimated_revenue[year] * base_cost
        return community_benefit_sharing_fund_cost_plan

    def calculate_carbon_standard_fees(self):
        base_cost = self.project.carbon_standard_fees
        carbon_standard_fees_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        estimated_credits_issued = self.sequestration_credits_calculator.calculate_est_credits_issued()
        for year in range(1, self.project_length + 1):
            carbon_standard_fees_cost_plan[year] = estimated_credits_issued[year] * base_cost
        return carbon_standard_fees_cost_plan

    def calculate_baseline_reassessment(self):
        base_cost = self.project.baseline_reassessment
        baseline_reassessment_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        for year in range(1, self.project_length + 1):
            if year % self.project.baseline_reassessment_frequency == 0:
                baseline_reassessment_cost_plan[year] = base_cost
        return baseline_reassessment_cost_plan

    def calculate_mrv(self):
        base_cost = self.project.MRV
        mrv_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        for year in range(1, self.project_length + 1):
            if year % self.project.verification_frequency == 0:
                mrv_cost_plan[year] = base_cost
        return mrv_cost_plan

    def calculate_long_term_project_operating(self):
        base_cost = self.project.long_term_project_operating
        long_term_project_operating_cost_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        for year in range(1, self.project_length + 1):
            long_term_project_operating_cost_plan[year] = base_cost
        return long_term_project_operating_cost_plan

    def get_summary(self):
        """Return a dictionary summary of the project metrics."""
        return {
            'Project': f'{self.project.country} {self.project.ecosystem}\n{self.project.activity} ({self.project.project_size_ha} ha)',
            '$/tCO2e (total cost, NPV)': f'${self.cost_per_tCO2e:,.0f}',
            '$/ha': f'${self.cost_per_ha:,.0f}',
            'NPV covering cost': f'${self.NPV_covering_cost:,.0f}',
            'IRR when priced to cover opex': f'{self.IRR_opex:.1%}',
            'IRR when priced to cover total costs': f'{self.IRR_total_cost:.1%}',
            'Total cost (NPV)': f'${self.total_NPV:,.0f}',
            'Capital expenditure (NPV)': f'${self.total_capex_NPV:,.0f}',
            'Operating expenditure (NPV)': f'${self.total_opex_NPV:,.0f}',
            'Credits issued': f'{self.credits_issued:,.0f}',
            'Total revenue (NPV)': f'${self.total_revenue_NPV:,.0f}',
            'Total revenue (non-discounted)': f'${self.total_revenue:,.0f}',
            'Financing cost': f'${self.financing_cost:,.0f}'
        }

    def get_cost_estimates(self):
        """Return a dataframe with all the CAPEX and OPEX cost estimates as Total cost and NPV cost."""
        data = {
            'Cost estimates (USD)': [
                sum(self.calculate_feasibility_analysis_cost().values()),
                sum(self.calculate_conservation_planning_and_admin().values()),
                sum(self.calculate_data_collection_and_field_cost().values()),
                sum(self.calculate_community_representation().values()),
                sum(self.calculate_blue_carbon_project_planning().values()),
                sum(self.calculate_establishing_carbon_rights().values()),
                sum(self.opex_total_cost_plan.values()),
                sum(self.calculate_monitoring().values()),
                sum(self.calculate_maintenance().values()),
                sum(self.calculate_cummunity_benefit_sharing_fund().values()),
                calculate_npv(self.calculate_baseline_reassessment(), self.project.discount_rate),
                calculate_npv(self.calculate_mrv(), self.project.discount_rate),
                calculate_npv(self.calculate_long_term_project_operating(), self.project.discount_rate),
                self.total_capex_NPV + self.total_opex_NPV
            ]
        }
        df = pd.DataFrame(data)
        df['Cost estimates (USD)'] = df['Cost estimates (USD)'].apply(
            lambda x: f'${x:,.0f}' if isinstance(x, (int, float)) else x)
        return df

    def get_yearly_cost_breakdown(self):
        """Returns a dataframe with yearly breakdown for each cost category."""

        def extend_cost_plan(cost_plan):
            return [cost_plan.get(year, 0) for year in range(-4, self.project_length + 1) if year != 0]

        years = [year for year in range(-4, self.project_length + 1) if year != 0] + ['Total', 'NPV']

        # Extend cost plans for all categories
        cost_plans = {
            'feasibility_analysis': self.calculate_feasibility_analysis_cost(),
            'conservation_planning_and_admin': self.calculate_conservation_planning_and_admin(),
            'data_collection_and_field': self.calculate_data_collection_and_field_cost(),
            'community_representation': self.calculate_community_representation(),
            'blue_carbon_project_planning': self.calculate_blue_carbon_project_planning(),
            'establishing_carbon_rights': self.calculate_establishing_carbon_rights(),
            'validation': self.calculate_validation(),
            'implementation_labor': self.calculate_implementation_labor(),
            'monitoring': self.calculate_monitoring(),
            'maintenance': self.calculate_maintenance(),
            'community_benefit_sharing_fund': self.calculate_cummunity_benefit_sharing_fund(),
            'carbon_standard_fees': self.calculate_carbon_standard_fees(),
            'baseline_reassessment': self.calculate_baseline_reassessment(),
            'MRV': self.calculate_mrv(),
            'long_term_project_operating': self.calculate_long_term_project_operating(),
            'capex_total': self.capex_total_cost_plan,
            'opex_total': self.opex_total_cost_plan
        }

        # Negate costs to represent outflows correctly
        for key, value in cost_plans.items():
            cost_plans[key] = {k: -v for k, v in value.items()}

        # Create the extended cost data structure
        extended_costs = {name: extend_cost_plan(plan) for name, plan in cost_plans.items()}

        # Add Total and NPV for each category
        for name, plan in cost_plans.items():
            extended_costs[name].append(sum(plan.values()))
            extended_costs[name].append(calculate_npv(plan, self.project.discount_rate))

        # Create DataFrame
        df = pd.DataFrame(extended_costs, index=years)
        return df

    def plot_financial_data(self):
        """Plot the summary of the financial data."""
        df = self.proforma
        time_period = df.columns[:-2]
        total_capex = df.loc['capex_total', time_period]
        total_opex = df.loc['opex_total', time_period]
        estimated_revenue = df.loc['Est. revenue', time_period]
        cumulative_net_income_revenue_opex = df.loc['Cumulative net income (revenue - OPEX)', time_period]
        annual_net_cash_flow = df.loc['Annual net cash flow', time_period]

        fig, ax1 = plt.subplots(figsize=(12, 8))
        ax1.bar(time_period, total_capex, label='Total Capex', color='blue', alpha=0.6)
        ax1.bar(time_period, total_opex, bottom=total_capex, label='Total Opex', color='lightblue', alpha=0.6)
        ax1.plot(time_period, estimated_revenue, label='Estimated Revenue', color='green', marker='o')
        ax1.plot(time_period, cumulative_net_income_revenue_opex, label='Cumulative Net Income (revenue - OPEX)',
                 color='yellow', marker='o')
        ax1.plot(time_period, annual_net_cash_flow, label='Annual Net Cash Flow', color='red', marker='o')
        ax1.set_xlabel('Time Periods')
        ax1.set_ylabel('Cash Flow (USD)', color='black')
        plt.title('Financial Overview: Capex, Opex, Revenue, Net Cash Flow, Cumulative Income')
        ax1.legend(loc='upper left')
        plt.tight_layout()
        plt.show()

# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: /home/elena/vizzuality/repos/tnc-blue-carbon-cost-tool/data/notebooks/../src/revenue_profit_calculator.py
# Bytecode version: 3.12.0rc2 (3531)
# Source timestamp: 2024-10-23 09:22:26 UTC (1729675346)

from sequestration_credits_calculator import SequestrationCreditsCalculator

class RevenueProfitCalculator:

    def __init__(self, project):
        """Initialize the RevenueProfitCalculator with a project object."""
        self.project = project
        self.sequestration_credits_calculator = SequestrationCreditsCalculator(self.project)
        if self.project.activity == 'Restoration':
            self.project_length = self.project.restoration_project_length
        else:
            self.project_length = self.project.conservation_project_length

    def calculate_est_revenue(self):
        """Calculate estimated revenue for the project."""
        estimated_revenue_plan = {year: 0 for year in range(-4, self.project.default_project_length + 1) if year != 0}
        estimated_credits_issued = self.sequestration_credits_calculator.calculate_est_credits_issued()
        for year, _ in estimated_revenue_plan.items():
            if year <= self.project_length:
                if year < -1:
                    estimated_revenue_plan[year] = 0
                else:
                    estimated_revenue_plan[year] = float(estimated_credits_issued[year]) * float(self.project.carbon_price) * (1 + float(self.project.carbon_price_increase)) ** int(year)
            else:
                estimated_revenue_plan[year] = 0
        return estimated_revenue_plan

    def calculate_annual_net_cash_flow(self, capex_total_cost_plan, opex_total_cost_plan):
        """
        Calculates the annual net cash flow (Revenue - Total Cost (CAPEX + OPEX))
        """
        estimated_revenue = self.calculate_est_revenue()
        cost_plans = {'capex_total': capex_total_cost_plan, 'opex_total': opex_total_cost_plan}
        for key, value in cost_plans.items():
            cost_plans[key] = {k: -v for k, v in value.items()}
        total_cost_plan = {k: cost_plans['capex_total'].get(k, 0) + cost_plans['opex_total'].get(k, 0) for k in set(cost_plans['capex_total']) | set(cost_plans['opex_total'])}
        annual_net_cash_flow = {year: estimated_revenue[year] + total_cost_plan.get(year, 0) if year != 0 else annual_net_cash_flow for year in range(-4, self.project_length + 1)}
        return annual_net_cash_flow

    def calculate_annual_net_income(self, opex_total_cost_plan):
        """
        Calculates the annual net income (Revenue - OPEX).
        """
        cost_plans = {'opex_total': opex_total_cost_plan}
        for key, value in cost_plans.items():
            cost_plans[key] = {k: -v for k, v in value.items()}
        estimated_revenue = self.calculate_est_revenue()
        annual_net_income = {year: estimated_revenue[year] + cost_plans['opex_total'].get(year, 0) if year != 0 else year for year in range(-4, self.project_length + 1)}
        return annual_net_income
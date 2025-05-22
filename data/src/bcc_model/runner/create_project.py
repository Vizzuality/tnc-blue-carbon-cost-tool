## Runner for the project
from bcc_model.blue_carbon_project import BlueCarbonProject
from bcc_model.breakeven_cost_calculator import BreakevenCostCalculator
from bcc_model.cost_calculator import CostCalculator
from bcc_model.runner.build_dependencies import get_data_dependencies
from bcc_model.types import BlueCarbonProjectParams

data_path = "../../../excel/Carbon-Cost Data Upload.xlsm"

master_table, base_size, base_increase = get_data_dependencies(data_path)

params = BlueCarbonProjectParams(project_name='Test_Project',
    project_size_ha=1000,
    activity="Restoration",
    ecosystem="Mangrove",
    country="Indonesia",
    master_table=master_table,
    base_size=base_size,
    base_increase=base_increase,
    carbon_price=30,
    carbon_revenues_to_cover="capex+Opex",
    restoration_activity="Planting",
    sequestration_rate_used="Tier 2 - Country-specific rate",
    project_specific_sequestration_rate=None,
    planting_success_rate=0.6,
                                 )

project = BlueCarbonProject(params)

calculator = CostCalculator(project)


cost_estimates = calculator.get_cost_estimates()

yearly_cost_breakdown = calculator.get_yearly_cost_breakdown()

breakeven_cost_calculator = BreakevenCostCalculator(project)

breakeven_cost = breakeven_cost_calculator.calculate_breakeven_cost()
print(f"The breakeven cost is: {breakeven_cost['breakeven_carbon_price']}")
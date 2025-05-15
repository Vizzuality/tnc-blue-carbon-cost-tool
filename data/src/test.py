import sys
import json

import pandas as pd

sys.path.append("../src/bcc_model")

from v2.blue_carbon_project import BlueCarbonProject
from v2.breakeven_cost_calculator import BreakevenCostCalculator
from v2.cost_calculator import CostCalculator
from v2.sensitivity_analysis import plot_sensitivity_analysis
from v2.utils import generate_master_table

data_path = "../excel/Carbon-Cost Data Upload.xlsm"

master_table = generate_master_table(data_path)


# Open the excel file - tab 'Base_size_table'
base_size = pd.read_excel(data_path, sheet_name="Base_size_table")

# Open the excel file - tab 'Base_increase'
base_increase = pd.read_excel(data_path, sheet_name="Base_increase")

# Example usage for a restoration project
Project = BlueCarbonProject(
    activity="Restoration",  # ['Restoration', 'Conservation']
    ecosystem="Mangrove",  #  ['Mangrove', 'Seagrass', 'Salt marsh']
    country="The Bahamas",  # [
    #'United States', 'Indonesia', 'Australia', 'Caribbean', 'Kenya', 'Mexico',
    # 'Colombia', 'India', 'China']
    master_table=master_table,
    base_size=base_size,
    base_increase=base_increase,
    carbon_price=30,  # Default value 30
    carbon_revenues_to_cover="Opex",  # ['Opex', 'capex+Opex']
    project_size_ha=1000,
    restoration_activity='Planting', # ['Planting', 'Hybrid', 'Hydrology']
    sequestration_rate_used='Tier 2 - Country-specific rate', # ['Tier 1 - IPCC default value',
    #  'Tier 2 - Country-specific rate', 'Tier 3 - Project-specific rate']
    # project_specific_sequestration_rate=None,
    planting_success_rate=0.6, # Default value 0.8
    #loss_rate_used="project-specific",  # ['National average', 'project-specific']
    #project_specific_loss_rate=-0.001,
    #emission_factor_used="Tier 2 - Country-specific emission factor",
    # ['Tier 1 - Global emission factor', 'Tier 2 - Country-specific emission factor',
    #  'Tier 3 - Project specific emission factor']
    # tier_3_project_specific_emission="AGB and SOC separately",
    # ['One emission factor', 'AGB and SOC separately']
    # tier_3_project_specific_emission_one_factor=0.5,
    # tier_3_emission_factor_AGB=0.5,
    # tier_3_emission_factor_SOC=0.5
)

print("DATA COLLECTION AND FIELD COST")
print(Project.data_collection_and_field_cost)

cost_calculator = CostCalculator(Project)


details = cost_calculator.get_cost_estimates()

# print(details)

# print(json.dumps(details, indent=4))
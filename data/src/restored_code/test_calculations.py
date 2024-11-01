import pandas as pd  # noqa: I001

from data.src.restored_code.blue_carbon_project import BlueCarbonProject
from data.src.restored_code.cost_calculator import CostCalculator

#%%
# Import excel with the import datai
data_path = "../../raw_data/data_ingestion.xlsm"

# Open the excel file - tab 'master_table'
master_table = pd.read_excel(data_path, sheet_name="master_table")

# Open the excel file - tab 'base_size_table'
base_size = pd.read_excel(data_path, sheet_name="base_size_table")

# Open the excel file - tab 'base_increase'
base_increase = pd.read_excel(data_path, sheet_name="base_increase")

Project = BlueCarbonProject(
    activity="Conservation",  # ['Restoration', 'Conservation']
    ecosystem="Mangrove",  #  ['Mangrove', 'Seagrass', 'Salt marsh']
    country="Indonesia",  # [
    #'United States', 'Indonesia', 'Australia', 'Caribbean', 'Kenya', 'Mexico',
    # 'Colombia', 'India', 'China']
    master_table=master_table,
    base_size=base_size,
    base_increase=base_increase,
    carbon_price=20,  # Default value 30
    carbon_revenues_to_cover="Opex",  # ['Opex', 'capex+Opex']
    project_size_ha=10000,
    # restoration_activity='Planting', # ['Planting', 'Hybrid', 'Hydrology']
    # sequestration_rate_used='Tier 1 - IPCC default value', # ['Tier 1 - IPCC default value',
    #  'Tier 2 - Country-specific rate', 'Tier 3 - Project-specific rate']
    # project_specific_sequestration_rate=None,
    # planting_success_rate=0.8, # Default value 0.8
    loss_rate_used="project-specific",  # ['National average', 'project-specific']
    project_specific_loss_rate=-0.001,
    emission_factor_used="Tier 2 - Country-specific emission factor",
    # ['Tier 1 - Global emission factor', 'Tier 2 - Country-specific emission factor',
    #  'Tier 3 - Project specific emission factor']
    # tier_3_project_specific_emission="AGB and SOC separately",
    # ['One emission factor', 'AGB and SOC separately']
    # tier_3_project_specific_emission_one_factor=0.5,
    # tier_3_emission_factor_AGB=0.5,
    # tier_3_emission_factor_SOC=0.5
)

## Aqui ya tengo los parametros necesarios para calcular el proyecto
#print(Project.get_project_parameters())





cost_calculator = CostCalculator(Project)

print(cost_calculator.get_summary())

## Helper to easily run and debug the source code
import json
import sys

import pandas as pd

sys.path.append("../src/bcc_model")

from v2.blue_carbon_project import BlueCarbonProject
from v2.breakeven_cost_calculator import BreakevenCostCalculator
from v2.cost_calculator import CostCalculator
from v2.sensitivity_analysis import plot_sensitivity_analysis
from v2.utils import generate_master_table

# Import excel with the import datai
data_path = "../excel/Carbon-Cost Data Upload.xlsm"

master_table = generate_master_table(data_path)
# Open the excel file - tab 'Base_size_table'
base_size = pd.read_excel(data_path, sheet_name="Base_size_table")

# Open the excel file - tab 'Base_increase'
base_increase = pd.read_excel(data_path, sheet_name="Base_increase")

### EXAMPLE 3
project_name = "Restoration_China_Salt_marsh"
# Example usage for a restoration project
project = BlueCarbonProject(
    activity="Restoration",  # ['Restoration', 'Conservation']
    ecosystem="Salt marsh",  #  ['Mangrove', 'Seagrass', 'Salt marsh']
    country="China",  # [
    #'United States', 'Indonesia', 'Australia', 'The Bahamas', 'Kenya', 'Mexico',
    # 'Colombia', 'India', 'China']
    master_table=master_table,
    base_size=base_size,
    base_increase=base_increase,
    carbon_price=30,  # Default value 30
    carbon_revenues_to_cover="Opex",  # ['Opex', 'capex+Opex']
    project_size_ha=500,
    restoration_activity="Hydrology",  # ['Planting', 'Hybrid', 'Hydrology']
    sequestration_rate_used="Tier 1 - IPCC default value",  # ['Tier 1 - IPCC default value',
    #  'Tier 2 - Country-specific rate', 'Tier 3 - Project-specific rate']
    # project_specific_sequestration_rate=None,
    planting_success_rate=0.8,  # Default value 0.8
    # loss_rate_used="project-specific",  # ['National average', 'project-specific']
    # project_specific_loss_rate=-0.001, # -0.10% loss rate
    # emission_factor_used="Tier 2 - Country-specific emission factor",
    # ['Tier 1 - Global emission factor', 'Tier 2 - Country-specific emission factor',
    #  'Tier 3 - Project specific emission factor']
    # tier_3_project_specific_emission="AGB and SOC separately",
    # ['One emission factor', 'AGB and SOC separately']
    # tier_3_project_specific_emission_one_factor=0.5,
    # tier_3_emission_factor_AGB=0.5,
    # tier_3_emission_factor_SOC=0.5
)


 ## Run the calculator
# cost_calculator = CostCalculator(project)
#
# print(cost_calculator.get_summary())


## Breakeve
## Calculate the breakeven cost
breakeven_cost_calculator = BreakevenCostCalculator(project)
breakeven_cost = breakeven_cost_calculator.calculate_breakeven_cost()
print(f"The breakeven cost is: {breakeven_cost['breakeven_carbon_price']}")



## DEBUG BREAKEVEN COST

from copy import deepcopy

if project.activity == "Restoration":
    output = {
        # "initialCarbonPriceComputationOutput": {
        #     "sequestrationRate": project_parameters["Project parameters"][
        #         "For Restoration Projects Only"
        #     ][project.sequestration_rate_used],
        #     "plantingSuccessRate": 0.8,
        #     "carbonRevenuesToCover": project_parameters["Project parameters"][
        #         "Carbon revenues to cover"
        #     ],
        #     "initialCarbonPrice": project_parameters["Project parameters"][
        #         "Initial carbon price assumption ($)"
        #     ],
        # },
        "breakevenPriceComputationOutput": {
            "carbonRevenuesToCover": breakeven_cost["project_params"]["Project parameters"][
                "Carbon revenues to cover"
            ],
            "sequestrationRate":breakeven_cost["project_params"]["Project parameters"][
                "For Restoration Projects Only"
            ][project.sequestration_rate_used],
            "plantingSuccessRate": 0.8,
            "initialCarbonPrice": float(
                breakeven_cost["project_params"]["Project parameters"][
                    "Initial carbon price assumption ($)"
                ]
            ),
        },
    }
else:
    output = {
        # "initialCarbonPriceComputationOutput": {
        #     "lossRate": project_parameters["Project parameters"]["For Conservation Projects Only"][
        #         "project-specific"
        #     ],
        #     "carbonRevenuesToCover": project_parameters["Project parameters"][
        #         "Carbon revenues to cover"
        #     ],
        #     "initialCarbonPrice": project_parameters["Project parameters"][
        #         "Initial carbon price assumption ($)"
        #     ],
        #     "emissionFactors": {
        #         "emissionFactor": None,
        #         "emissionFactorAgb": project_parameters["Project parameters"][
        #             "For Conservation Projects Only"
        #         ]["Country-specific emission factors"]["Emission factor AGB"],  # noqa: E501
        #         "emissionFactorSoc": project_parameters["Project parameters"][
        #             "For Conservation Projects Only"
        #         ]["Country-specific emission factors"]["Emission factor SOC"],  # noqa: E501
        #     },
        # },
        "breakevenPriceComputationOutput": {
            # Update values as first element of the list
            "lossRate": breakeven_cost["project_params"]["Project parameters"][
                "For Conservation Projects Only"
            ]["project-specific"],  # noqa: E501
            "carbonRevenuesToCover": breakeven_cost["project_params"]["Project parameters"][
                "Carbon revenues to cover"
            ],
            "initialCarbonPrice": float(
                breakeven_cost["project_params"]["Project parameters"][
                    "Initial carbon price assumption ($)"
                ]
            ),
            "emissionFactors": {
                "emissionFactor": None,
                "emissionFactorAgb": breakeven_cost["project_params"]["Project parameters"][
                    "For Conservation Projects Only"
                ]["Country-specific emission factors"]["Emission factor AGB"],  # noqa: E501
                "emissionFactorSoc": breakeven_cost["project_params"]["Project parameters"][
                    "For Conservation Projects Only"
                ]["Country-specific emission factors"]["Emission factor SOC"],  # noqa: E501
            },
        },
    }

# initial_carbon_price_computation_output = {
#     "totalProjectCost": {
#         "total": {
#             "total": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Total cost", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "capex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Capital expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "opex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#         "npv": {
#             "total": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Total cost", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "capex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Capital expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "opex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#     },
#     "leftover": {
#         # review when is OPEX + CAPEX
#         "total": {
#             "total": int(
#                 cost_summary["Project summary"]["Total revenue (non-discounted)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "leftover": int(
#                 cost_summary["Project summary"]["Total revenue (non-discounted)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             - int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             if project_parameters["Project parameters"]["Carbon revenues to cover"] == "Opex"
#             else int(
#                 cost_summary["Project summary"]["Total revenue (non-discounted)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             - int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Total cost", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "opex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             if project_parameters["Project parameters"]["Carbon revenues to cover"] == "Opex"
#             else int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Total cost", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#         "npv": {
#             "total": int(
#                 cost_summary["Project summary"]["Total revenue (NPV)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "leftover": int(
#                 cost_summary["Project summary"]["Total revenue (NPV)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             - int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             if project_parameters["Project parameters"]["Carbon revenues to cover"] == "Opex"
#             else int(
#                 cost_summary["Project summary"]["Total revenue (NPV)"]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             - int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Total cost", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "opex": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             )
#             if project_parameters["Project parameters"]["Carbon revenues to cover"] == "Opex"
#             else int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Total cost", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#     },
#     "summary": {
#         "$/tCO2e (total cost, NPV)": int(
#             cost_summary["Project summary"]["$/tCO2e (total cost, NPV)"]
#             .replace("$", "")
#             .replace(",", "")
#         ),
#         "$/ha": int(cost_summary["Project summary"]["$/ha"].replace("$", "").replace(",", "")),
#         "NPV covering cost": int(
#             cost_summary["Project summary"]["NPV covering cost"].replace("$", "").replace(",", "")
#         ),
#         # double check this attribute - this value should be the same as the NPV covering cost so how is it used?  # noqa: E501
#         "Leftover after OpEx / total cost": int(
#             cost_summary["Project summary"]["NPV covering cost"].replace("$", "").replace(",", "")
#         ),
#         "IRR when priced to cover OpEx": float(
#             cost_summary["Project summary"]["IRR when priced to cover opex"].replace("%", "")
#         )
#         / 100,
#         "IRR when priced to cover total cost": float(
#             cost_summary["Project summary"]["IRR when priced to cover total costs"].replace("%", "")
#         )
#         / 100,
#         "Total cost (NPV)": int(
#             cost_summary["Project summary"]["Total cost (NPV)"].replace("$", "").replace(",", "")
#         ),
#         "Capital expenditure (NPV)": int(
#             cost_summary["Project summary"]["Capital expenditure (NPV)"]
#             .replace("$", "")
#             .replace(",", "")
#         ),
#         "Operating expenditure (NPV)": int(
#             cost_summary["Project summary"]["Operating expenditure (NPV)"]
#             .replace("$", "")
#             .replace(",", "")
#         ),
#         "Credits issued": int(cost_summary["Project summary"]["Credits issued"].replace(",", "")),
#         "Total revenue (NPV)": int(
#             cost_summary["Project summary"]["Total revenue (NPV)"].replace("$", "").replace(",", "")
#         ),
#         "Total revenue (non-discounted)": int(
#             cost_summary["Project summary"]["Total revenue (non-discounted)"]
#             .replace("$", "")
#             .replace(",", "")
#         ),
#         "Financing cost": int(
#             cost_summary["Project summary"]["Financing cost"].replace("$", "").replace(",", "")
#         ),
#         # dueble check - we should remove this and just show the fundin gap (NPV)
#         "Funding gap": int(
#             cost_summary["Project summary"]["Funding gap (NPV)"].replace("$", "").replace(",", "")
#         ),
#         "Funding gap (NPV)": int(
#             cost_summary["Project summary"]["Funding gap (NPV)"].replace("$", "").replace(",", "")
#         ),
#         "Funding gap per tCO2e (NPV)": float(
#             cost_summary["Project summary"]["Funding gap per tCO2e (NPV)"]
#             .replace("$", "")
#             .replace(",", "")
#         ),
#         "Community benefit sharing fund": int(
#             cost_summary["Project summary"]["Community benefit sharing fund % of revenue"]
#             .replace("%", "")
#             .replace(",", "")
#         )
#         / 100,
#     },
#     "costDetails": {
#         "total": {
#             "capitalExpenditure": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Capital expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "operationalExpenditure": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "totalCost": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Total cost", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "feasibilityAnalysis": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Feasibility analysis",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "conservationPlanningAndAdmin": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Conservation planning and admin",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "dataCollectionAndFieldCost": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Data collection and field costs",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "communityRepresentation": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Community representation / liaison",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "blueCarbonProjectPlanning": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Blue carbon project planning",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "establishingCarbonRights": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Establishing carbon rights",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "validation": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Validation", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "implementationLabor": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Implementation labor",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "monitoring": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Monitoring", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "maintenance": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Maintenance", "Total cost"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "communityBenefitSharingFund": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Community benefit sharing fund",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "carbonStandardFees": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Carbon standard fees",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "baselineReassessment": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Baseline reassessment",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "mrv": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "MRV", "Total cost"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "longTermProjectOperatingCost": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Long-term project operating",
#                     "Total cost",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#         "npv": {
#             "capitalExpenditure": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Capital expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "operationalExpenditure": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Operating expenditure", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "totalCost": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Total cost", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "feasibilityAnalysis": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Feasibility analysis", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "conservationPlanningAndAdmin": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Conservation planning and admin",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "dataCollectionAndFieldCost": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Data collection and field costs",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "communityRepresentation": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Community representation / liaison",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "blueCarbonProjectPlanning": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Blue carbon project planning",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "establishingCarbonRights": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Establishing carbon rights",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "validation": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Validation", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "implementationLabor": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Implementation labor", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "monitoring": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Monitoring", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "maintenance": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "Maintenance", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "communityBenefitSharingFund": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Community benefit sharing fund",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "carbonStandardFees": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Carbon standard fees", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "baselineReassessment": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Baseline reassessment", "NPV"
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "mrv": int(
#                 cost_estimates.loc[cost_estimates["Cost estimates (USD)"] == "MRV", "NPV"]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#             "longTermProjectOperatingCost": int(
#                 cost_estimates.loc[
#                     cost_estimates["Cost estimates (USD)"] == "Long-term project operating",
#                     "NPV",
#                 ]
#                 .values[0]
#                 .replace("$", "")
#                 .replace(",", "")
#             ),
#         },
#     },
#     "yearlyBreakdown": [
#         {
#             "costName": "feasibilityAnalysis",
#             "totalCost": float(yearly_cost_breakdown.loc["Feasibility analysis"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Feasibility analysis"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Feasibility analysis"][:-2].items()),
#         },
#         {
#             "costName": "conservationPlanningAndAdmin",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Conservation planning and admin"]["Total"]
#             ),
#             "totalNPV": float(yearly_cost_breakdown.loc["Conservation planning and admin"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Conservation planning and admin"][:-2].items()
#             ),
#         },
#         {
#             "costName": "dataCollectionAndFieldCost",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Data collection and field costs"]["Total"]
#             ),
#             "totalNPV": float(yearly_cost_breakdown.loc["Data collection and field costs"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Data collection and field costs"][:-2].items()
#             ),
#         },
#         {
#             "costName": "blueCarbonProjectPlanning",
#             "totalCost": float(yearly_cost_breakdown.loc["Blue carbon project planning"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Blue carbon project planning"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Blue carbon project planning"][:-2].items()
#             ),
#         },
#         {
#             "costName": "communityRepresentation",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Community representation / liaison"]["Total"]
#             ),
#             "totalNPV": float(
#                 yearly_cost_breakdown.loc["Community representation / liaison"]["NPV"]
#             ),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Community representation / liaison"][:-2].items()
#             ),
#         },
#         {
#             "costName": "establishingCarbonRights",
#             "totalCost": float(yearly_cost_breakdown.loc["Establishing carbon rights"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Establishing carbon rights"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Establishing carbon rights"][:-2].items()
#             ),
#         },
#         {
#             "costName": "validation",
#             "totalCost": float(yearly_cost_breakdown.loc["Validation"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Validation"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Validation"][:-2].items()),
#         },
#         {
#             "costName": "implementationLabor",
#             "totalCost": float(yearly_cost_breakdown.loc["Implementation labor"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Implementation labor"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Implementation labor"][:-2].items()),
#         },
#         {
#             "costName": "monitoring",
#             "totalCost": float(yearly_cost_breakdown.loc["Monitoring"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Monitoring"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Monitoring"][:-2].items()),
#         },
#         {
#             "costName": "maintenance",
#             "totalCost": float(yearly_cost_breakdown.loc["Maintenance"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Maintenance"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Maintenance"][:-2].items()),
#         },
#         {
#             "costName": "communityBenefitSharingFund",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Community benefit sharing fund"]["Total"]
#             ),
#             "totalNPV": float(yearly_cost_breakdown.loc["Community benefit sharing fund"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Community benefit sharing fund"][:-2].items()
#             ),
#         },
#         {
#             "costName": "carbonStandardFees",
#             "totalCost": float(yearly_cost_breakdown.loc["Carbon standard fees"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Carbon standard fees"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Carbon standard fees"][:-2].items()),
#         },
#         {
#             "costName": "baselineReassessment",
#             "totalCost": float(yearly_cost_breakdown.loc["Baseline reassessment"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Baseline reassessment"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Baseline reassessment"][:-2].items()),
#         },
#         {
#             "costName": "mrv",
#             "totalCost": float(yearly_cost_breakdown.loc["MRV"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["MRV"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["MRV"][:-2].items()),
#         },
#         {
#             "costName": "longTermProjectOperatingCost",
#             "totalCost": float(yearly_cost_breakdown.loc["Long-term project operating"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Long-term project operating"]["NPV"]),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Long-term project operating"][:-2].items()
#             ),
#         },
#         {
#             "costName": "opexTotalCostPlan",
#             "totalCost": float(yearly_cost_breakdown.loc["Total opex"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Total opex"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Total opex"][:-2].items()),
#         },
#         {
#             "costName": "capexTotalCostPlan",
#             "totalCost": float(yearly_cost_breakdown.loc["Total capex"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Total capex"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Total capex"][:-2].items()),
#         },
#         {
#             "costName": "totalCostPlan",
#             "totalCost": float(yearly_cost_breakdown.loc["Total cost"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Total cost"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Total cost"][:-2].items()),
#         },
#         {
#             "costName": "estimatedRevenuePlan",
#             "totalCost": float(yearly_cost_breakdown.loc["Est. revenue"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Est. revenue"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Est. revenue"][:-2].items()),
#         },
#         {
#             "costName": "creditsIssuedPlan",
#             "totalCost": float(yearly_cost_breakdown.loc["Est. credits issued"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Est. credits issued"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Est. credits issued"][:-2].items()),
#         },
#         {
#             "costName": "cumulativeNetIncomePlan",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - OPEX)"]["Total"]
#             ),
#             "totalNPV": float(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - OPEX)"]["NPV"]
#             ),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - OPEX)"][:-2].items()
#             ),
#         },
#         {
#             "costName": "cumulativeNetIncomeCapexOpex",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - CAPEX - OPEX)"]["Total"]
#             ),
#             "totalNPV": float(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - CAPEX - OPEX)"]["NPV"]
#             ),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Cumulative net income (revenue - CAPEX - OPEX)"][
#                     :-2
#                 ].items()
#             ),
#         },
#         {
#             "costName": "annualNetCashFlow",
#             "totalCost": float(yearly_cost_breakdown.loc["Annual net cash flow"]["Total"]),
#             "totalNPV": float(yearly_cost_breakdown.loc["Annual net cash flow"]["NPV"]),
#             "costValues": dict(yearly_cost_breakdown.loc["Annual net cash flow"][:-2].items()),
#         },
#         {
#             "costName": "annualNetIncome",
#             "totalCost": float(
#                 yearly_cost_breakdown.loc["Annual net income (revenue – OPEX)"]["Total"]
#             ),
#             "totalNPV": float(
#                 yearly_cost_breakdown.loc["Annual net income (revenue – OPEX)"]["NPV"]
#             ),
#             "costValues": dict(
#                 yearly_cost_breakdown.loc["Annual net income (revenue – OPEX)"][:-2].items()
#             ),
#         },
#     ],
# }
breakeven_carbon_price_computation_output = {
    "totalProjectCost": {
        "total": {
            "total": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "capex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "opex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
        "npv": {
            "total": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "capex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "opex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
    },
    "leftover": {
        "total": {
            "total": int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (non-discounted)"]
                .replace("$", "")
                .replace(",", "")
            ),
            "leftover": int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (non-discounted)"]
                .replace("$", "")
                .replace(",", "")
            )
            - int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            )
            if breakeven_cost["project_params"]["Project parameters"]["Carbon revenues to cover"]
            == "Opex"
            else int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (non-discounted)"]
                .replace("$", "")
                .replace(",", "")
            )
            - int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "opex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            )
            if breakeven_cost["project_params"]["Project parameters"]["Carbon revenues to cover"]
            == "Opex"
            else int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
        "npv": {
            "total": int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (NPV)"]
                .replace("$", "")
                .replace(",", "")
            ),
            "leftover": int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (NPV)"]
                .replace("$", "")
                .replace(",", "")
            )
            - int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            )
            if breakeven_cost["project_params"]["Project parameters"]["Carbon revenues to cover"]
            == "Opex"
            else int(
                breakeven_cost["cost_summary"]["Project summary"]["Total revenue (NPV)"]
                .replace("$", "")
                .replace(",", "")
            )
            - int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "opex": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            )
            if breakeven_cost["project_params"]["Project parameters"]["Carbon revenues to cover"]
            == "Opex"
            else int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
    },
    "summary": {
        "$/tCO2e (total cost, NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["$/tCO2e (total cost, NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "$/ha": int(
            breakeven_cost["cost_summary"]["Project summary"]["$/ha"]
            .replace("$", "")
            .replace(",", "")
        ),
        "NPV covering cost": int(
            breakeven_cost["cost_summary"]["Project summary"]["NPV covering cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        # double check this attribute - this value should be the same as the NPV covering cost so how is it used?  # noqa: E501
        "Leftover after OpEx / total cost": int(
            breakeven_cost["cost_summary"]["Project summary"]["NPV covering cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        "IRR when priced to cover OpEx": float(
            breakeven_cost["cost_summary"]["Project summary"][
                "IRR when priced to cover opex"
            ].replace("%", "")
        )
        / 100,
        "IRR when priced to cover total cost": float(
            breakeven_cost["cost_summary"]["Project summary"][
                "IRR when priced to cover total costs"
            ].replace("%", "")
        )
        / 100,
        "Total cost (NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Total cost (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Capital expenditure (NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Capital expenditure (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Operating expenditure (NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Operating expenditure (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Credits issued": int(
            breakeven_cost["cost_summary"]["Project summary"]["Credits issued"].replace(",", "")
        ),
        "Total revenue (NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Total revenue (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Total revenue (non-discounted)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Total revenue (non-discounted)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Financing cost": int(
            breakeven_cost["cost_summary"]["Project summary"]["Financing cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        # dueble check - we should remove this and just show the fundin gap (NPV)
        "Funding gap": int(
            breakeven_cost["cost_summary"]["Project summary"]["Funding gap (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Funding gap (NPV)": int(
            breakeven_cost["cost_summary"]["Project summary"]["Funding gap (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Funding gap per tCO2e (NPV)": float(
            breakeven_cost["cost_summary"]["Project summary"]["Funding gap per tCO2e (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Community benefit sharing fund": int(
            breakeven_cost["cost_summary"]["Project summary"][
                "Community benefit sharing fund % of revenue"
            ]
            .replace("%", "")
            .replace(",", "")
        )
        / 100,
    },
    "costDetails": {
        "total": {
            "capitalExpenditure": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "operationalExpenditure": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "totalCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "feasibilityAnalysis": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Feasibility analysis",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "conservationPlanningAndAdmin": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Conservation planning and admin",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "dataCollectionAndFieldCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Data collection and field costs",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityRepresentation": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Community representation / liaison",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "blueCarbonProjectPlanning": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Blue carbon project planning",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "establishingCarbonRights": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Establishing carbon rights",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "validation": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Validation",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "implementationLabor": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Implementation labor",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "monitoring": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Monitoring",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "maintenance": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Maintenance",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityBenefitSharingFund": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Community benefit sharing fund",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "carbonStandardFees": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Carbon standard fees",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "baselineReassessment": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Baseline reassessment",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "mrv": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "MRV",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "longTermProjectOperatingCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Long-term project operating",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
        "npv": {
            "capitalExpenditure": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "operationalExpenditure": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "totalCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "feasibilityAnalysis": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Feasibility analysis",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "conservationPlanningAndAdmin": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Conservation planning and admin",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "dataCollectionAndFieldCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Data collection and field costs",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityRepresentation": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Community representation / liaison",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "blueCarbonProjectPlanning": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Blue carbon project planning",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "establishingCarbonRights": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Establishing carbon rights",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "validation": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Validation",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "implementationLabor": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Implementation labor",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "monitoring": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Monitoring",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "maintenance": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "Maintenance",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityBenefitSharingFund": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Community benefit sharing fund",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "carbonStandardFees": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Carbon standard fees",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "baselineReassessment": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Baseline reassessment",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "mrv": int(
                breakeven_cost["cost_estimates"]
                .loc[breakeven_cost["cost_estimates"]["Cost estimates (USD)"] == "MRV", "NPV"]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "longTermProjectOperatingCost": int(
                breakeven_cost["cost_estimates"]
                .loc[
                    breakeven_cost["cost_estimates"]["Cost estimates (USD)"]
                    == "Long-term project operating",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
    },
    "yearlyBreakdown": [
        {
            "costName": "feasibilityAnalysis",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Feasibility analysis"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Feasibility analysis"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Feasibility analysis"][:-2].items()
            ),
        },
        {
            "costName": "conservationPlanningAndAdmin",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Conservation planning and admin"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Conservation planning and admin"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Conservation planning and admin"][:-2].items()
            ),
        },
        {
            "costName": "dataCollectionAndFieldCost",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Data collection and field costs"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Data collection and field costs"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Data collection and field costs"][:-2].items()
            ),
        },
        {
            "costName": "blueCarbonProjectPlanning",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Blue carbon project planning"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Blue carbon project planning"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Blue carbon project planning"][:-2].items()
            ),
        },
        {
            "costName": "communityRepresentation",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Community representation / liaison"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Community representation / liaison"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"]
                .loc["Community representation / liaison"][:-2]
                .items()
            ),
        },
        {
            "costName": "establishingCarbonRights",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Establishing carbon rights"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Establishing carbon rights"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Establishing carbon rights"][:-2].items()
            ),
        },
        {
            "costName": "validation",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Validation"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Validation"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Validation"][:-2].items()),
        },
        {
            "costName": "implementationLabor",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Implementation labor"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Implementation labor"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Implementation labor"][:-2].items()
            ),
        },
        {
            "costName": "monitoring",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Monitoring"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Monitoring"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Monitoring"][:-2].items()),
        },
        {
            "costName": "maintenance",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Maintenance"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Maintenance"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Maintenance"][:-2].items()),
        },
        {
            "costName": "communityBenefitSharingFund",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Community benefit sharing fund"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Community benefit sharing fund"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Community benefit sharing fund"][:-2].items()
            ),
        },
        {
            "costName": "carbonStandardFees",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Carbon standard fees"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Carbon standard fees"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Carbon standard fees"][:-2].items()
            ),
        },
        {
            "costName": "baselineReassessment",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Baseline reassessment"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Baseline reassessment"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Baseline reassessment"][:-2].items()
            ),
        },
        {
            "costName": "mrv",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["MRV"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["MRV"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["MRV"][:-2].items()),
        },
        {
            "costName": "longTermProjectOperatingCost",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Long-term project operating"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Long-term project operating"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Long-term project operating"][:-2].items()
            ),
        },
        {
            "costName": "opexTotalCostPlan",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Total opex"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Total opex"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Total opex"][:-2].items()),
        },
        {
            "costName": "capexTotalCostPlan",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Total capex"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Total capex"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Total capex"][:-2].items()),
        },
        {
            "costName": "totalCostPlan",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Total cost"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Total cost"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Total cost"][:-2].items()),
        },
        {
            "costName": "estimatedRevenuePlan",
            "totalCost": float(breakeven_cost["cost_pro_forma"].loc["Est. revenue"]["Total"]),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Est. revenue"]["NPV"]),
            "costValues": dict(breakeven_cost["cost_pro_forma"].loc["Est. revenue"][:-2].items()),
        },
        {
            "costName": "creditsIssuedPlan",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Est. credits issued"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Est. credits issued"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Est. credits issued"][:-2].items()
            ),
        },
        {
            "costName": "cumulativeNetIncomePlan",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Cumulative net income (revenue - OPEX)"][
                    "Total"
                ]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Cumulative net income (revenue - OPEX)"][
                    "NPV"
                ]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"]
                .loc["Cumulative net income (revenue - OPEX)"][:-2]
                .items()
            ),
        },
        {
            "costName": "cumulativeNetIncomeCapexOpex",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc[
                    "Cumulative net income (revenue - CAPEX - OPEX)"
                ]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc[
                    "Cumulative net income (revenue - CAPEX - OPEX)"
                ]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"]
                .loc["Cumulative net income (revenue - CAPEX - OPEX)"][:-2]
                .items()
            ),
        },
        {  # sum of total cost + est revenue
            "costName": "annualNetCashFlow",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Annual net cash flow"]["Total"]
            ),
            "totalNPV": float(breakeven_cost["cost_pro_forma"].loc["Annual net cash flow"]["NPV"]),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"].loc["Annual net cash flow"][:-2].items()
            ),
        },
        {  # sum total opex + est revenue
            "costName": "annualNetIncome",
            "totalCost": float(
                breakeven_cost["cost_pro_forma"].loc["Annual net income (revenue – OPEX)"]["Total"]
            ),
            "totalNPV": float(
                breakeven_cost["cost_pro_forma"].loc["Annual net income (revenue – OPEX)"]["NPV"]
            ),
            "costValues": dict(
                breakeven_cost["cost_pro_forma"]
                .loc["Annual net income (revenue – OPEX)"][:-2]
                .items()
            ),
        },
    ],
}

# output["initialCarbonPriceComputationOutput"] = {
#     **output["initialCarbonPriceComputationOutput"],
#     **initial_carbon_price_computation_output,
# }
output["breakevenPriceComputationOutput"] = {
    **output["breakevenPriceComputationOutput"],
    **breakeven_carbon_price_computation_output,
}

# output["initialCarbonPriceComputationOutput"] = deepcopy(initial_carbon_price_computation_output)
# output["breakevenPriceComputationOutput"] = deepcopy(breakeven_carbon_price_computation_output)

# export output as json file
with open(f"./test_data/breakeven_smoke_test_output_{project_name}.json", "w") as f:
    json.dump(output, f, indent=4)



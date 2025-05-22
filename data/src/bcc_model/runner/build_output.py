## Utility to generate a computation output as a json dump replicating the platform's backend response



## TODO: Most likely we can use the same logic to generate an output for both computation types, I need to check that both CostCalculator and
##       BreakevenCostCalculator have the same output format. Haven't gotten to that yet.

class BreakEvenCostOutput:
    def __init__(self, breakeven_cost):
        self.breakeven_cost = breakeven_cost

    def total_project_cost(self, breakeven_cost):
        totalProjectCost =  {
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
    }
        return totalProjectCost

    def _leftover(self, breakeven_cost):
        leftover =  {
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
        return leftover

    def _summary(self, cost_summary):
        summary =  {
        "$/tCO2e (total cost, NPV)": int(
            cost_summary["Project summary"]["$/tCO2e (total cost, NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "$/ha": int(
            cost_summary["Project summary"]["$/ha"]
            .replace("$", "")
            .replace(",", "")
        ),
        "NPV covering cost": int(
            cost_summary["Project summary"]["NPV covering cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        # double check this attribute - this value should be the same as the NPV covering cost so how is it used?  # noqa: E501
        "Leftover after OpEx / total cost": int(
            cost_summary["Project summary"]["NPV covering cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        "IRR when priced to cover OpEx": float(
            cost_summary["Project summary"][
                "IRR when priced to cover opex"
            ].replace("%", "")
        )
        / 100,
        "IRR when priced to cover total cost": float(
            cost_summary["Project summary"][
                "IRR when priced to cover total costs"
            ].replace("%", "")
        )
        / 100,
        "Total cost (NPV)": int(
            cost_summary["Project summary"]["Total cost (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Capital expenditure (NPV)": int(
            cost_summary["Project summary"]["Capital expenditure (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Operating expenditure (NPV)": int(
            cost_summary["Project summary"]["Operating expenditure (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Credits issued": int(
            cost_summary["Project summary"]["Credits issued"].replace(",", "")
        ),
        "Total revenue (NPV)": int(
            cost_summary["Project summary"]["Total revenue (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Total revenue (non-discounted)": int(
            cost_summary["Project summary"]["Total revenue (non-discounted)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Financing cost": int(
            cost_summary["Project summary"]["Financing cost"]
            .replace("$", "")
            .replace(",", "")
        ),
        # dueble check - we should remove this and just show the fundin gap (NPV)
        "Funding gap": int(
            cost_summary["Project summary"]["Funding gap (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Funding gap (NPV)": int(
            cost_summary["Project summary"]["Funding gap (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Funding gap per tCO2e (NPV)": float(
            cost_summary["Project summary"]["Funding gap per tCO2e (NPV)"]
            .replace("$", "")
            .replace(",", "")
        ),
        "Community benefit sharing fund": int(
            cost_summary["Project summary"][
                "Community benefit sharing fund % of revenue"
            ]
            .replace("%", "")
            .replace(",", "")
        )
        / 100,
    },
        return summary

    def _cost_details(self, cost_estimates):
        cost_details = {
        "total": {
            "capitalExpenditure": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "operationalExpenditure": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "totalCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "feasibilityAnalysis": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Feasibility analysis",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "conservationPlanningAndAdmin": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Conservation planning and admin",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "dataCollectionAndFieldCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Data collection and field costs",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityRepresentation": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Community representation / liaison",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "blueCarbonProjectPlanning": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Blue carbon project planning",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "establishingCarbonRights": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Establishing carbon rights",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "validation": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Validation",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "implementationLabor": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Implementation labor",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "monitoring": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Monitoring",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "maintenance": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Maintenance",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityBenefitSharingFund": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Community benefit sharing fund",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "carbonStandardFees": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Carbon standard fees",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "baselineReassessment": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Baseline reassessment",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "mrv": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "MRV",
                    "Total cost",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "longTermProjectOperatingCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
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
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Capital expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "operationalExpenditure": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Operating expenditure",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "totalCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Total cost",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "feasibilityAnalysis": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Feasibility analysis",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "conservationPlanningAndAdmin": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Conservation planning and admin",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "dataCollectionAndFieldCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Data collection and field costs",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityRepresentation": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Community representation / liaison",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "blueCarbonProjectPlanning": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Blue carbon project planning",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "establishingCarbonRights": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Establishing carbon rights",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "validation": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Validation",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "implementationLabor": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Implementation labor",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "monitoring": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Monitoring",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "maintenance": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "Maintenance",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "communityBenefitSharingFund": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Community benefit sharing fund",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "carbonStandardFees": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Carbon standard fees",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "baselineReassessment": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Baseline reassessment",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "mrv": int(
                cost_estimates
                .loc[cost_estimates["cost_estimates"]["Cost estimates (USD)"] == "MRV", "NPV"]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
            "longTermProjectOperatingCost": int(
                cost_estimates
                .loc[
                    cost_estimates["cost_estimates"]["Cost estimates (USD)"]
                    == "Long-term project operating",
                    "NPV",
                ]
                .values[0]
                .replace("$", "")
                .replace(",", "")
            ),
        },
    }
        return cost_details

    def _yearly_breakdown(self, cost_pro_forma):
        yearlyBreakdown = [
        {
            "costName": "feasibilityAnalysis",
            "totalCost": float(
                cost_pro_forma.loc["Feasibility analysis"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Feasibility analysis"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Feasibility analysis"][:-2].items()
            ),
        },
        {
            "costName": "conservationPlanningAndAdmin",
            "totalCost": float(
                cost_pro_forma.loc["Conservation planning and admin"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Conservation planning and admin"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Conservation planning and admin"][:-2].items()
            ),
        },
        {
            "costName": "dataCollectionAndFieldCost",
            "totalCost": float(
                cost_pro_forma.loc["Data collection and field costs"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Data collection and field costs"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Data collection and field costs"][:-2].items()
            ),
        },
        {
            "costName": "blueCarbonProjectPlanning",
            "totalCost": float(
                cost_pro_forma.loc["Blue carbon project planning"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Blue carbon project planning"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Blue carbon project planning"][:-2].items()
            ),
        },
        {
            "costName": "communityRepresentation",
            "totalCost": float(
                cost_pro_forma.loc["Community representation / liaison"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Community representation / liaison"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma
                .loc["Community representation / liaison"][:-2]
                .items()
            ),
        },
        {
            "costName": "establishingCarbonRights",
            "totalCost": float(
                cost_pro_forma.loc["Establishing carbon rights"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Establishing carbon rights"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Establishing carbon rights"][:-2].items()
            ),
        },
        {
            "costName": "validation",
            "totalCost": float(cost_pro_forma.loc["Validation"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Validation"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Validation"][:-2].items()),
        },
        {
            "costName": "implementationLabor",
            "totalCost": float(
                cost_pro_forma.loc["Implementation labor"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Implementation labor"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Implementation labor"][:-2].items()
            ),
        },
        {
            "costName": "monitoring",
            "totalCost": float(cost_pro_forma.loc["Monitoring"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Monitoring"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Monitoring"][:-2].items()),
        },
        {
            "costName": "maintenance",
            "totalCost": float(cost_pro_forma.loc["Maintenance"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Maintenance"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Maintenance"][:-2].items()),
        },
        {
            "costName": "communityBenefitSharingFund",
            "totalCost": float(
                cost_pro_forma.loc["Community benefit sharing fund"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Community benefit sharing fund"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Community benefit sharing fund"][:-2].items()
            ),
        },
        {
            "costName": "carbonStandardFees",
            "totalCost": float(
                cost_pro_forma.loc["Carbon standard fees"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Carbon standard fees"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Carbon standard fees"][:-2].items()
            ),
        },
        {
            "costName": "baselineReassessment",
            "totalCost": float(
                cost_pro_forma.loc["Baseline reassessment"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Baseline reassessment"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Baseline reassessment"][:-2].items()
            ),
        },
        {
            "costName": "mrv",
            "totalCost": float(cost_pro_forma.loc["MRV"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["MRV"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["MRV"][:-2].items()),
        },
        {
            "costName": "longTermProjectOperatingCost",
            "totalCost": float(
                cost_pro_forma.loc["Long-term project operating"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Long-term project operating"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma.loc["Long-term project operating"][:-2].items()
            ),
        },
        {
            "costName": "opexTotalCostPlan",
            "totalCost": float(cost_pro_forma.loc["Total opex"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Total opex"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Total opex"][:-2].items()),
        },
        {
            "costName": "capexTotalCostPlan",
            "totalCost": float(cost_pro_forma.loc["Total capex"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Total capex"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Total capex"][:-2].items()),
        },
        {
            "costName": "totalCostPlan",
            "totalCost": float(cost_pro_forma.loc["Total cost"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Total cost"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Total cost"][:-2].items()),
        },
        {
            "costName": "estimatedRevenuePlan",
            "totalCost": float(cost_pro_forma.loc["Est. revenue"]["Total"]),
            "totalNPV": float(cost_pro_forma.loc["Est. revenue"]["NPV"]),
            "costValues": dict(cost_pro_forma.loc["Est. revenue"][:-2].items()),
        },
        {
            "costName": "creditsIssuedPlan",
            "totalCost": float(
                cost_pro_forma.loc["Est. credits issued"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Est. credits issued"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Est. credits issued"][:-2].items()
            ),
        },
        {
            "costName": "cumulativeNetIncomePlan",
            "totalCost": float(
                cost_pro_forma.loc["Cumulative net income (revenue - OPEX)"][
                    "Total"
                ]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Cumulative net income (revenue - OPEX)"][
                    "NPV"
                ]
            ),
            "costValues": dict(
                cost_pro_forma
                .loc["Cumulative net income (revenue - OPEX)"][:-2]
                .items()
            ),
        },
        {
            "costName": "cumulativeNetIncomeCapexOpex",
            "totalCost": float(
                cost_pro_forma.loc[
                    "Cumulative net income (revenue - CAPEX - OPEX)"
                ]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc[
                    "Cumulative net income (revenue - CAPEX - OPEX)"
                ]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma
                .loc["Cumulative net income (revenue - CAPEX - OPEX)"][:-2]
                .items()
            ),
        },
        {  # sum of total cost + est revenue
            "costName": "annualNetCashFlow",
            "totalCost": float(
                cost_pro_forma.loc["Annual net cash flow"]["Total"]
            ),
            "totalNPV": float(cost_pro_forma.loc["Annual net cash flow"]["NPV"]),
            "costValues": dict(
                cost_pro_forma.loc["Annual net cash flow"][:-2].items()
            ),
        },
        {  # sum total opex + est revenue
            "costName": "annualNetIncome",
            "totalCost": float(
                cost_pro_forma.loc["Annual net income (revenue – OPEX)"]["Total"]
            ),
            "totalNPV": float(
                cost_pro_forma.loc["Annual net income (revenue – OPEX)"]["NPV"]
            ),
            "costValues": dict(
                cost_pro_forma
                .loc["Annual net income (revenue – OPEX)"][:-2]
                .items()
            ),
        },
    ]
        return yearlyBreakdown


    def build(self):
        total_project_cost = self.total_project_cost(self.breakeven_cost)
        leftover = self._leftover(self.breakeven_cost)
        summary = self._summary(self.breakeven_cost["cost_summary"])
        cost_details = self._cost_details(self.breakeven_cost["cost_estimates"])
        yearly_breakdown = self._yearly_breakdown(self.breakeven_cost["cost_pro_forma"])

        output = {
            "lossRate": self.breakeven_cost["project_params"]["Project parameters"][
                "For Conservation Projects Only"
            ]["project-specific"],  # noqa: E501
            "carbonRevenuesToCover":self.breakeven_cost["project_params"]["Project parameters"][
                "Carbon revenues to cover"
            ],
            "initialCarbonPrice": float(
                self.breakeven_cost["project_params"]["Project parameters"][
                    "Initial carbon price assumption ($)"
                ]
            ),
            "emissionFactors": {
                "emissionFactor": None,
                "emissionFactorAgb": self.breakeven_cost["project_params"]["Project parameters"][
                    "For Conservation Projects Only"
                ]["Country-specific emission factors"]["Emission factor AGB"],  # noqa: E501
                "emissionFactorSoc": self.breakeven_cost["project_params"]["Project parameters"][
                    "For Conservation Projects Only"
                ]["Country-specific emission factors"]["Emission factor SOC"],  # noqa: E501
            },
            "totalProjectCost": total_project_cost,
            "leftover": leftover,
            "summary": summary,
            "costDetails": cost_details,
            "yearlyBreakdown": yearly_breakdown,
        }

        return output







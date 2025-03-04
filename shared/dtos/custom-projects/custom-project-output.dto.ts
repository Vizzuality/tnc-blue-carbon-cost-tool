import { OverridableCostInputs } from "@shared/dtos/custom-projects/cost.inputs";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";

export type CustomProjectSummary = {
  "$/tCO2e (total cost, NPV)": number;
  "$/ha": number;
  "IRR when priced to cover OpEx": number;
  "IRR when priced to cover total cost": number;
  "Total cost (NPV)": number;
  "Capital expenditure (NPV)": number;
  "Operating expenditure (NPV)": number;
  "Credits issued": number;
  "Total revenue (NPV)": number;
  "Total revenue (non-discounted)": number;
  "Financing cost": number;
  "Funding gap (NPV)": number;
  "Funding gap per tCO2e (NPV)": number;
  "Community benefit sharing fund": number;
  "Net revenue after OPEX": number | undefined;
  "Net revenue after Total cost": number | undefined;
};

const SORTED_CUSTOM_PROJECT_SUMMARY_KEYS = [
  "$/tCO2e (total cost, NPV)",
  "$/ha",
  "Net revenue after OPEX",
  "Net revenue after Total cost",
  "IRR when priced to cover OpEx",
  "IRR when priced to cover total cost",
  "Total cost (NPV)",
  "Capital expenditure (NPV)",
  "Operating expenditure (NPV)",
  "Credits issued",
  "Total revenue (NPV)",
  "Total revenue (non-discounted)",
  "Financing cost",
  "Funding gap (NPV)",
  "Funding gap per tCO2e (NPV)",
  "Community benefit sharing fund",
] as const;

export const sortCustomProjectSummary = (
  summary: CustomProjectSummary,
): CustomProjectSummary => {
  const sortedObj: Partial<CustomProjectSummary> = {};

  for (
    let keyIdx = 0;
    keyIdx < SORTED_CUSTOM_PROJECT_SUMMARY_KEYS.length;
    keyIdx++
  ) {
    const key = SORTED_CUSTOM_PROJECT_SUMMARY_KEYS[keyIdx];
    if (key in summary) {
      sortedObj[key] = summary[key];
    }
  }

  return sortedObj as CustomProjectSummary;
};

export type CustomProjectCostDetails = {
  capitalExpenditure: number;
  operationalExpenditure: number;
  totalCost: number;
  feasibilityAnalysis: number;
  conservationPlanningAndAdmin: number;
  dataCollectionAndFieldCost: number;
  communityRepresentation: number;
  blueCarbonProjectPlanning: number;
  establishingCarbonRights: number;
  validation: number;
  implementationLabor: number;
  monitoring: number;
  maintenance: number;
  communityBenefitSharingFund: number;
  carbonStandardFees: number;
  baselineReassessment: number;
  mrv: number;
  longTermProjectOperatingCost: number;
};

export type OutputCostNames =
  | "opexTotalCostPlan"
  | "capexTotalCostPlan"
  | "totalCostPlan"
  | "estimatedRevenuePlan"
  | "creditsIssuedPlan"
  | "cumulativeNetIncomePlan"
  | "cumulativeNetIncomeCapexOpex"
  | "annualNetCashFlow"
  | "annualNetIncome";

export type YearlyBreakdownCostName =
  | keyof InstanceType<typeof OverridableCostInputs>
  | OutputCostNames;

export type YearlyBreakdown = {
  costName: YearlyBreakdownCostName;
  totalCost: number;
  totalNPV: number;
  costValues: CostPlanMap;
};

export type CostPlanMap = {
  [year: number]: number;
};

export type CustomProjectOutput = {
  initialCarbonPriceComputationOutput:
    | ConservationProjectOutput
    | RestorationProjectOutput;
  breakevenPriceComputationOutput:
    | ConservationProjectOutput
    | RestorationProjectOutput
    | null;
};

export class RestorationProjectOutput {
  // lossRate: number;
  // emissionFactors: {
  //   emissionFactor: number | null;
  //   emissionFactorAgb: number;
  //   emissionFactorSoc: number;
  // };
  sequestrationRate: number;
  plantingSuccessRate: number;
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;
  initialCarbonPrice: number;
  totalProjectCost: {
    total: {
      total: number;
      capex: number;
      opex: number;
    };
    npv: {
      total: number;
      capex: number;
      opex: number;
    };
  };
  leftover: {
    total: {
      total: number;
      leftover: number;
      opex: number;
    };
    npv: {
      total: number;
      leftover: number;
      opex: number;
    };
  };
  summary: CustomProjectSummary;
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
  yearlyBreakdown: YearlyBreakdown[];
}

export class ConservationProjectOutput {
  lossRate: number;
  emissionFactors: {
    emissionFactor: number;
    emissionFactorAgb: number;
    emissionFactorSoc: number;
  };
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;
  initialCarbonPrice: number;
  totalProjectCost: {
    total: {
      total: number;
      capex: number;
      opex: number;
    };
    npv: {
      total: number;
      capex: number;
      opex: number;
    };
  };
  leftover: {
    total: {
      total: number;
      leftover: number;
      opex: number;
    };
    npv: {
      total: number;
      leftover: number;
      opex: number;
    };
  };
  summary: CustomProjectSummary;
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
  yearlyBreakdown: YearlyBreakdown[];
}

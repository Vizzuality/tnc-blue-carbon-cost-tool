import { OverridableCostInputs } from "@shared/dtos/custom-projects/cost.inputs";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";

export type CustomProjectSummary = {
  "$/tCO2e (total cost, NPV)": number;
  "$/ha": number;
  "NPV covering cost": number;
  "Leftover after OpEx / total cost": number | null;
  "IRR when priced to cover OpEx": number;
  "IRR when priced to cover total cost": number;
  "Total cost (NPV)": number;
  "Capital expenditure (NPV)": number;
  "Operating expenditure (NPV)": number;
  "Credits issued": number;
  "Total revenue (NPV)": number;
  "Total revenue (non-discounted)": number;
  "Financing cost": number;
  "Funding gap": number;
  "Funding gap (NPV)": number;
  "Funding gap per tCO2e (NPV)": number;
  "Community benefit sharing fund": number;
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

export type OutputCostNames = keyof [
  "opexTotalCostPlan",
  "capexTotalCostPlan",
  "totalCostPlan",
  "estimatedRevenuePlan",
  "creditsIssuedPlan",
  "cumulativeNetIncomePlan",
  "cumulativeNetIncomeCapexOpex",
  "annualNetCashFlow",
  "annualNetIncome",
];

export type YearlyBreakdownCostName = keyof OverridableCostInputs &
  OutputCostNames;

export type YearlyBreakdown = {
  costName: YearlyBreakdownCostName;
  totalCost: number;
  totalNPV: number;
  costValues: CostPlanMap;
};

export type CostPlanMap = {
  [year: number]: number;
};

export type CustomProjectOutput =
  | ConservationProjectOutput
  | RestorationProjectOutput;

export class RestorationProjectOutput {
  // to be defined. it will share most of the props, but probably carbon input related fields will be different
  // i.e conservation does not account for sequestration rate, but restoration does
  // Restoration does not care about emission factors, but conservation does
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

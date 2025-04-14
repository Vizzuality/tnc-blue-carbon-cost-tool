export type CostPlanMap = {
  [year: number]: number;
};

/**
 * @description: This enum is used to define the keys for the cost plan map.
 */
export enum COST_KEYS {
  FEASIBILITY_ANALYSIS = 'feasibilityAnalysis',
  CONSERVATION_PLANNING_AND_ADMIN = 'conservationPlanningAndAdmin',
  DATA_COLLECTION_AND_FIELD_COST = 'dataCollectionAndFieldCost',
  COMMUNITY_REPRESENTATION = 'communityRepresentation',
  BLUE_CARBON_PROJECT_PLANNING = 'blueCarbonProjectPlanning',
  ESTABLISHING_CARBON_RIGHTS = 'establishingCarbonRights',
  FINANCING_COST = 'financingCost',
  VALIDATION = 'validation',
  MONITORING = 'monitoring',
  BASELINE_REASSESSMENT = 'baselineReassessment',
  MRV = 'mrv',
  LONG_TERM_PROJECT_OPERATING_COST = 'longTermProjectOperatingCost',
  IMPLEMENTATION_LABOR = 'implementationLabor',
  MAINTENANCE = 'maintenance',
  COMMUNITY_BENEFIT_SHARING_FUND = 'communityBenefitSharingFund',
  CARBON_STANDARD_FEES = 'carbonStandardFees',
}

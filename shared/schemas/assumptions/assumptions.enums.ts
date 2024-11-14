export enum ECOSYSTEM_RESTORATION_RATE_NAMES {
  MANGROVE = "Mangrove restoration rate",
  SEAGRASS = "Seagrass restoration rate",
  SALT_MARSH = "Salt marsh restoration rate",
}

export enum ACTIVITY_PROJECT_LENGTH_NAMES {
  CONSERVATION = "Conservation project length",
  RESTORATION = "Restoration project length",
}

export const COMMON_OVERRIDABLE_ASSUMPTION_NAMES = [
  "Baseline reassessment frequency",
  "Buffer",
  "Carbon price increase",
  "Discount rate",
  "Verification frequency",
] as const;

export const ASSUMPTIONS_NAME_TO_DTO_MAP = {
  "Baseline reassessment frequency": "baselineReassessmentFrequency",
  Buffer: "buffer",
  "Carbon price increase": "carbonPriceIncrease",
  "Discount rate": "discountRate",
  "Verification frequency": "verificationFrequency",
  "Mangrove restoration rate": "restorationRate",
  "Seagrass restoration rate": "restorationRate",
  "Salt marsh restoration rate": "restorationRate",
  "Conservation project length": "projectLength",
  "Restoration project length": "projectLength",
} as const;

export const COSTS_DTO_TO_NAME_MAP = {
  feasibilityAnalysis: "Feasibility analysis",
  conservationPlanningAndAdmin: "Conservation planning and admin",
  dataCollectionAndFieldCost: "Data collection and field cost",
  communityRepresentation: "Community representation",
  blueCarbonProjectPlanning: "Blue carbon project planning",
  establishingCarbonRights: "Establishing carbon rights",
  validation: "Validation",
  implementationLabor: "Implementation labor",
  monitoring: "Monitoring",
  maintenance: "Maintenance",
  communityBenefitSharingFund: "Community benefit sharing fund",
  carbonStandardFees: "Carbon standard fees",
  baselineReassessment: "Baseline reassessment",
  mrv: "MRV",
  longTermProjectOperatingCost: "Long term project operating cost",
  financingCost: "Financing cost",
}

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

export const COSTS_DTO_MAP = {
  feasibilityAnalysis: { label: "Feasibility analysis", unit: "$/project" },
  conservationPlanningAndAdmin: {
    label: "Conservation planning and admin",
    unit: "$/yr",
  },
  dataCollectionAndFieldCost: {
    label: "Data collection and field cost",
    unit: "$/yr",
  },
  communityRepresentation: { label: "Community representation", unit: "$/yr" },
  blueCarbonProjectPlanning: {
    label: "Blue carbon project planning",
    unit: "$/project",
  },
  establishingCarbonRights: {
    label: "Establishing carbon rights",
    unit: "$/yr",
  },
  validation: { label: "Validation", unit: "$/project" },
  implementationLabor: { label: "Implementation labor", unit: "$/ha" },
  monitoring: { label: "Monitoring", unit: "$/yr" },
  maintenance: { label: "Maintenance", unit: "%" },
  communityBenefitSharingFund: {
    label: "Community benefit sharing fund",
    unit: "%",
  },
  carbonStandardFees: { label: "Carbon standard fees", unit: "$/credit" },
  baselineReassessment: { label: "Baseline reassessment", unit: "$/event" },
  mrv: { label: "MRV", unit: "$/event" },
  longTermProjectOperatingCost: {
    label: "Long term project operating cost",
    unit: "$/yr",
  },
  financingCost: { label: "Financing cost", unit: "%" },
};

import { COST_INPUT_OVERRIDES } from "@client/src/constants/tooltip";

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
  "Carbon price",
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

export const ASSUMPTIONS_NAME_TO_TOOLTIP_MAP = {
  "Baseline reassessment frequency": "BASELINE_REASSESSMENT_FREQUENCY",
  Buffer: "BUFFER",
  "Carbon price increase": "CARBON_PRICE_INCREASE",
  "Discount rate": "DISCOUNT_RATE",
  "Verification frequency": "VERIFICATION_FREQUENCY",
  "Seagrass restoration rate": "RESTORATION_RATE",
  "Conservation project length": "CONSERVATION_PROJECT_LENGTH",
  "Restoration project length": "RESTORATION_PROJECT_LENGTH",
} as const;

export const COSTS_DTO_MAP = {
  feasibilityAnalysis: {
    label: "Feasibility analysis",
    unit: "$/project",
    tooltipContent: COST_INPUT_OVERRIDES.FEASIBILITY_ANALYSIS,
  },
  conservationPlanningAndAdmin: {
    label: "Conservation planning and admin",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.CONSERVATION_PLANNING_AND_ADMIN,
  },
  dataCollectionAndFieldCost: {
    label: "Data collection and field cost",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.DATA_COLLECTION_AND_FIELD_COSTS,
  },
  communityRepresentation: {
    label: "Community representation",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.COMMUNITY_REPRESENTATION,
  },
  blueCarbonProjectPlanning: {
    label: "Blue carbon project planning",
    unit: "$/project",
    tooltipContent: COST_INPUT_OVERRIDES.BLUE_CARBON_PROJECT_PLANNING,
  },
  establishingCarbonRights: {
    label: "Establishing carbon rights",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.ESTABLISHING_CARBON_RIGHTS,
  },
  validation: {
    label: "Validation",
    unit: "$/project",
    tooltipContent: COST_INPUT_OVERRIDES.VALIDATION,
  },
  implementationLabor: {
    label: "Implementation labor",
    unit: "$/ha",
    tooltipContent: COST_INPUT_OVERRIDES.IMPLEMENTATION_LABOR,
  },
  monitoring: {
    label: "Monitoring",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.MONITORING,
  },
  maintenance: {
    label: "Maintenance",
    unit: "%",
    tooltipContent: COST_INPUT_OVERRIDES.MAINTENANCE,
  },
  communityBenefitSharingFund: {
    label: "Landowner/community benefit share",
    unit: "%",
    tooltipContent: COST_INPUT_OVERRIDES.COMMUNITY_BENEFIT_SHARING_FUND,
  },
  carbonStandardFees: {
    label: "Carbon standard fees",
    unit: "$/credit",
    tooltipContent: COST_INPUT_OVERRIDES.CARBON_STANDARD_FEES,
  },
  baselineReassessment: {
    label: "Baseline reassessment",
    unit: "$/event",
    tooltipContent: COST_INPUT_OVERRIDES.BASELINE_REASSESSMENT,
  },
  mrv: {
    label: "MRV",
    unit: "$/event",
    tooltipContent: COST_INPUT_OVERRIDES.MRV,
  },
  longTermProjectOperatingCost: {
    label: "Long term project operating cost",
    unit: "$/yr",
    tooltipContent: COST_INPUT_OVERRIDES.LONG_TERM_PROJECT_OPERATING,
  },
  financingCost: {
    label: "Financing cost",
    unit: "%",
    tooltipContent: COST_INPUT_OVERRIDES.FINANCING_COST,
  },
} as const;

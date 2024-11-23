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

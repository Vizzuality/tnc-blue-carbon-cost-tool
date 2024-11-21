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

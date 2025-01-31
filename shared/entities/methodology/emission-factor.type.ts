export const EMISSION_FACTOR_TYPE = {
  SOC: "SOC",
  AGB: "AGB",
  global: "global",
  t2CountrySpecificAGB: "t2CountrySpecificAGB",
  t2CountrySpecificSOC: "t2CountrySpecificSOC",
} as const;

export type EmissionFactorType =
  (typeof EMISSION_FACTOR_TYPE)[keyof typeof EMISSION_FACTOR_TYPE];

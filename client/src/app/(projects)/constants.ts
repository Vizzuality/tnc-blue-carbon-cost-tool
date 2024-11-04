export const LAYOUT_TRANSITIONS = {
  duration: 0.4,
  ease: "easeInOut",
};

export const PROJECT_SIZE_VALUES = ["small", "medium", "large"] as const;
export const CARBON_PRICING_TYPE_VALUES = [
  "market_price",
  "opex_breakeven_price",
] as const;
export const COST_VALUES = ["total", "npv"] as const;

export const FILTER_KEYS = [
  "keyword",
  "projectSizeFilter",
  "priceType",
  "totalCost",
  "countryCode",
  "ecosystem",
  "activity",
  "activitySubtype",
  "cost",
  "abatementPotential",
] as const;

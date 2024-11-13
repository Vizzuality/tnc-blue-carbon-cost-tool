export const LAYOUT_TRANSITIONS = {
  duration: 0.4,
  ease: "easeInOut",
};

export const FILTER_KEYS = [
  "keyword",
  "projectSizeFilter",
  "priceType",
  "costRangeSelector",
  "countryCode",
  "ecosystem",
  "activity",
  "activitySubtype",
  "costRange",
  "abatementPotentialRange",
] as const;

// ? cost and abatement potential ranges are hardcoded for now.
// ? Ask data to figure out the correct values and hardcore them here.
export const INITIAL_COST_RANGE = [1200, 2300];
export const INITIAL_ABATEMENT_POTENTIAL_RANGE = [0, 100];

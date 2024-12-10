import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/url-store";

import { scorecardFiltersSchema } from "./view/scorecard-prioritization/schema";

export const NO_DATA = [];

const OMITTED_FIELDS = [
  "keyword",
  "costRange",
  "abatementPotentialRange",
  "costRangeSelector",
];

export const filtersToQueryParams = (
  filters: z.infer<typeof filtersSchema | typeof scorecardFiltersSchema>,
) => {
  debugger;
  const queryParams = Object.keys(filters)
    .filter((key) => !OMITTED_FIELDS.includes(key))
    .reduce(
      (acc, key) => ({
        ...acc,
        ...(Array.isArray(filters[key as keyof typeof filters]) && {
          [`filter[${key}]`]: filters[key as keyof typeof filters],
        }),
      }),
      {},
    );
  return queryParams;
};

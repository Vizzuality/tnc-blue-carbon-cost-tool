import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/url-store";

import { scorecardFiltersSchema } from "@/containers/overview/table/view/scorecard-prioritization/schema";

export const NO_DATA = [];

const OMITTED_FIELDS = [
  "keyword",
  "costRange",
  "abatementPotentialRange",
  "costRangeSelector",
  "priceType",
];

export const filtersToQueryParams = (
  filters: z.infer<typeof filtersSchema | typeof scorecardFiltersSchema>,
) => {
  return Object.keys(filters)
    .filter(
      (key) =>
        !OMITTED_FIELDS.includes(key) &&
        filters[key as keyof typeof filters] !== "",
    )
    .reduce(
      (acc, key) => ({
        ...acc,
        [`filter[${key}]`]: filters[key as keyof typeof filters],
      }),
      {},
    );
};

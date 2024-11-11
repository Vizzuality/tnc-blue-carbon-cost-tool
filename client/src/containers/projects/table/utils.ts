import { Project } from "@shared/entities/projects.entity";
import { z } from "zod";

import { filtersSchema } from "@/app/(projects)/url-store";

export const NO_DATA: Project[] = [];

const OMITTED_FIELDS = [
  "keyword",
  "costRange",
  "abatementPotentialRange",
  "costRangeSelector",
];

export const filtersToQueryParams = (
  filters: z.infer<typeof filtersSchema>,
) => {
  return Object.keys(filters)
    .filter((key) => !OMITTED_FIELDS.includes(key))
    .reduce(
      (acc, key) => ({
        ...acc,
        ...(filters[key as keyof typeof filters]?.length && {
          [`filter[${key}]`]: filters[key as keyof typeof filters],
        }),
      }),
      {},
    );
};

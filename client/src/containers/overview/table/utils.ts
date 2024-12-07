import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { Project } from "@shared/entities/projects.entity";
import { z } from "zod";

import {
  filtersSchema,
  scorecardFiltersSchema,
} from "@/app/(overview)/url-store";

export const NO_DATA: Project[] = [];
export const NO_SCORECARD_DATA: ProjectScorecardView[] = [];

const OMITTED_FIELDS = [
  "keyword",
  "costRange",
  "abatementPotentialRange",
  "costRangeSelector",
];

export const filtersToQueryParams = (
  filters: z.infer<typeof filtersSchema | typeof scorecardFiltersSchema>,
) => {
  return Object.keys(filters)
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
};

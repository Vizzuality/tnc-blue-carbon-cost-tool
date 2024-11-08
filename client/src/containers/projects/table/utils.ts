import { Project } from "@shared/entities/projects.entity";
import { z } from "zod";

import { filtersSchema } from "@/app/(projects)/url-store";

export const NO_DATA: Project[] = [];

export const filtersToQueryParams = (
  filters: z.infer<typeof filtersSchema>,
) => {
  return Object.keys(filters)
    .filter((key) => key !== "keyword")
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

import { Project } from "@shared/entities/projects.entity";
import { z } from "zod";

import { filtersSchema } from "@/app/(projects)/url-store";

export const NO_DATA: Project[] = [];

type OMITTED_FILTERS = "totalCost";

export const filtersToQueryParams = (
  filters: Omit<z.infer<typeof filtersSchema>, OMITTED_FILTERS>,
) => {
  return Object.keys(filters).reduce(
    (acc, key) => ({
      ...acc,
      [`filter[${key}]`]:
        filters[key as keyof Omit<typeof filters, OMITTED_FILTERS>],
    }),
    {},
  );
};

import { Project } from "@shared/entities/projects.entity";
import { Column } from "@tanstack/react-table";
import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/url-store";

import { scorecardFiltersSchema } from "@/containers/overview/table/view/scorecard-prioritization/schema";

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

export const getColumnSortTitle = (column: Column<Partial<Project>>) => {
  if (!column.getCanSort()) {
    return undefined;
  }

  const nextSortOrder = column.getNextSortingOrder();

  if (nextSortOrder === "asc") {
    return "Sort ascending";
  }

  if (nextSortOrder === "desc") {
    return "Sort descending";
  }

  // If column is projectName, then we want to toggle between asc/desc
  if (column.id === "projectName") {
    return "Sort ascending";
  }

  return "Clear sort";
};

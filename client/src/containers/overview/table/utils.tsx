import { PropsWithChildren } from "react";

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

export const getColumnSortTitle = <T = unknown,>(column: Column<T>) => {
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

export const HeaderText = ({ children }: PropsWithChildren) => (
  <span className="text-xs font-normal">{children}</span>
);

export const CellText = ({ children }: PropsWithChildren) => (
  <span className="text-sm font-normal">{children}</span>
);

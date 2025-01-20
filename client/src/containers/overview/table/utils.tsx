import { PropsWithChildren, useState } from "react";

import { Column, SortingState, Updater } from "@tanstack/react-table";
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

export const getAccessor = <T extends string>(
  baseName: T,
  isNPV: boolean,
): T | `${T}NPV` => (isNPV ? `${baseName}NPV` : baseName);

export const DEFAULT_SORTING: SortingState = [
  {
    id: "projectName",
    desc: false,
  },
];

export function useSorting() {
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;

    // We want to toggle projectName between asc/desc only (other columns can be asc/desc/none)
    if (
      newSorting.length === 0 &&
      sorting.some((s) => s.id === "projectName")
    ) {
      setSorting([{ id: "projectName", desc: false }]);
    } else {
      setSorting(newSorting.length === 0 ? DEFAULT_SORTING : newSorting);
    }
  };

  return { sorting, handleSortingChange };
}

export const DEFAULT_TABLE_SETTINGS = {
  // Explicitly set to false to forces sorting to always follow the asc-desc-undefined cycle
  // see https://github.com/TanStack/table/issues/4289
  sortDescFirst: false,
  manualPagination: true,
};

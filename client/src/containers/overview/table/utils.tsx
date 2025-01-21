import { ComponentProps, PropsWithChildren, useState } from "react";

import { Column, SortingState, Updater } from "@tanstack/react-table";

import { TableCell } from "@/components/ui/table";

export const NO_DATA = [];

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

export const NoResults = (props: ComponentProps<typeof TableCell>) => (
  <TableCell {...props} className="text-center">
    <div className="flex flex-1 justify-center">No results.</div>
  </TableCell>
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

import { useAtom } from "jotai";
import { parseAsJson, parseAsStringLiteral, useQueryState } from "nuqs";
import { z } from "zod";

import {
  filtersSchema,
  INITIAL_FILTERS_STATE,
} from "@/app/(overview)/constants";
import { popupAtom } from "@/app/(overview)/store";

import { TABLE_VIEWS } from "@/containers/overview/table/toolbar/table-selector";

export interface Parameter<T = keyof z.infer<typeof filtersSchema>> {
  key: T;
  label: string;
  className: string;
  tooltipContent?: React.ReactNode;
  options: {
    label: string;
    value: string;
    disabled?: boolean;
  }[];
}

export function useProjectOverviewFilters() {
  const [popup, setPopup] = useAtom(popupAtom);
  const [filters, setFilters] = useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );

  const updateFilters = async (
    updater: (
      prev: typeof INITIAL_FILTERS_STATE,
    ) => typeof INITIAL_FILTERS_STATE,
  ) => {
    await setFilters(updater);
    if (popup) setPopup(null);
  };

  return [filters, updateFilters] as const;
}

export function useTableView() {
  return useQueryState(
    "table",
    parseAsStringLiteral(TABLE_VIEWS).withDefault("overview"),
  );
}

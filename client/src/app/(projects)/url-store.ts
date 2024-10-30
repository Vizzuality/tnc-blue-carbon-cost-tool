import {
  parseAsJson,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { z } from "zod";

import {
  PROJECT_SIZE_VALUES,
  CARBON_PRICING_TYPE_VALUES,
  COST_VALUES,
  FILTER_KEYS,
} from "@/app/(projects)/constants";

import { TABLE_VIEWS } from "@/containers/projects/table/toolbar/table-selector";

export const filtersSchema = z.object({
  [FILTER_KEYS[0]]: z.string().optional(),
  [FILTER_KEYS[1]]: z.enum(PROJECT_SIZE_VALUES),
  [FILTER_KEYS[2]]: z.enum(CARBON_PRICING_TYPE_VALUES),
  [FILTER_KEYS[3]]: z.enum(COST_VALUES),
});

export function useGlobalFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault({
      keyword: "",
      projectSizeFilter: "medium",
      priceType: "market_price",
      totalCost: "npv",
    }),
  );
}

export function useSyncCountry() {
  return useQueryState("country", parseAsString.withDefault(""));
}

export function useTableView() {
  return useQueryState(
    "table",
    parseAsStringLiteral(TABLE_VIEWS).withDefault("overview"),
  );
}

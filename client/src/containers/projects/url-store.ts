import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { FILTER_KEYS } from "@/app/(overview)/constants";

export enum CUSTOM_PROJECT_PRICE_TYPE {
  INITIAL_CARBON_PRICE_ASSUMPTION = "Initial carbon price assumption",
  BREAKEVEN_PRICE = "Breakeven price",
}

export const filtersSchema = z.object({
  [FILTER_KEYS[2]]: z.nativeEnum(CUSTOM_PROJECT_PRICE_TYPE),
  [FILTER_KEYS[3]]: z.nativeEnum(COST_TYPE_SELECTOR),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  priceType: CUSTOM_PROJECT_PRICE_TYPE.INITIAL_CARBON_PRICE_ASSUMPTION,
  costRangeSelector: COST_TYPE_SELECTOR.NPV,
};

export function useCustomProjectFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );
}

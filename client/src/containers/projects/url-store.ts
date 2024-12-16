import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { FILTER_KEYS } from "@/app/(overview)/constants";

export const filtersSchema = z.object({
  [FILTER_KEYS[2]]: z.nativeEnum(PROJECT_PRICE_TYPE),
  [FILTER_KEYS[3]]: z.nativeEnum(COST_TYPE_SELECTOR),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  priceType: PROJECT_PRICE_TYPE.MARKET_PRICE,
  costRangeSelector: COST_TYPE_SELECTOR.NPV,
};

export function useCustomProjectFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );
}

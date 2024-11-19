import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";

import { FILTER_KEYS } from "@/app/(overview)/constants";

import { INITIAL_COST_RANGE } from "@/containers/overview/filters/constants";

export const filtersSchema = z.object({
  [FILTER_KEYS[2]]: z.nativeEnum(PROJECT_PRICE_TYPE),
  [FILTER_KEYS[3]]: z.nativeEnum(COST_TYPE_SELECTOR),
  [FILTER_KEYS[8]]: z.array(z.number()).length(2),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  priceType: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
  costRangeSelector: COST_TYPE_SELECTOR.NPV,
  costRange: INITIAL_COST_RANGE[COST_TYPE_SELECTOR.NPV],
};

export function useGlobalFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );
}

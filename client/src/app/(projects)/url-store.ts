import { ACTIVITY, RESTORATION_ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { parseAsJson, parseAsStringLiteral, useQueryState } from "nuqs";
import { z } from "zod";

import {
  PROJECT_SIZE_VALUES,
  CARBON_PRICING_TYPE_VALUES,
  COST_VALUES,
  FILTER_KEYS,
} from "@/app/(projects)/constants";

import { TABLE_VIEWS } from "@/containers/projects/table/toolbar/table-selector";

const SUB_ACTIVITIES = RESTORATION_ACTIVITY;

export const filtersSchema = z.object({
  [FILTER_KEYS[0]]: z.string().optional(),
  [FILTER_KEYS[1]]: z.enum(PROJECT_SIZE_VALUES),
  [FILTER_KEYS[2]]: z.enum(CARBON_PRICING_TYPE_VALUES),
  [FILTER_KEYS[3]]: z.enum(COST_VALUES),
  [FILTER_KEYS[4]]: z.string().optional(),
  [FILTER_KEYS[5]]: z.array(z.nativeEnum(ECOSYSTEM)),
  [FILTER_KEYS[6]]: z.array(z.nativeEnum(ACTIVITY)),
  [FILTER_KEYS[7]]: z.array(z.nativeEnum(SUB_ACTIVITIES)),
  [FILTER_KEYS[8]]: z.array(z.number()).length(2),
  [FILTER_KEYS[9]]: z.array(z.number()).length(2),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  keyword: "",
  projectSizeFilter: "medium",
  priceType: "market_price",
  totalCost: "npv",
  countryCode: "",
  ecosystem: [],
  activity: [],
  activitySubtype: [],
  cost: [0, 0],
  abatementPotential: [0, 0],
};

export function useGlobalFilters() {
  return useQueryState(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(INITIAL_FILTERS_STATE),
  );
}

export function useTableView() {
  return useQueryState(
    "table",
    parseAsStringLiteral(TABLE_VIEWS).withDefault("overview"),
  );
}

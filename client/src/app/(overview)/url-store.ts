import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from "@shared/entities/projects.entity";
import { useAtom } from "jotai";
import { parseAsJson, parseAsStringLiteral, useQueryState } from "nuqs";
import { z } from "zod";

import { FILTER_KEYS } from "@/app/(overview)/constants";
import { popupAtom } from "@/app/(overview)/store";

import {
  INITIAL_COST_RANGE,
  INITIAL_ABATEMENT_POTENTIAL_RANGE,
} from "@/containers/overview/filters/constants";
import { TABLE_VIEWS } from "@/containers/overview/table/toolbar/table-selector";

const SUB_ACTIVITIES = RESTORATION_ACTIVITY_SUBTYPE;

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

export const filtersSchema = z.object({
  [FILTER_KEYS[0]]: z.string().optional(),
  [FILTER_KEYS[1]]: z.nativeEnum(PROJECT_SIZE_FILTER),
  [FILTER_KEYS[2]]: z.nativeEnum(PROJECT_PRICE_TYPE),
  [FILTER_KEYS[3]]: z.nativeEnum(COST_TYPE_SELECTOR),
  [FILTER_KEYS[4]]: z.string().optional(),
  [FILTER_KEYS[5]]: z.array(z.nativeEnum(ECOSYSTEM)),
  [FILTER_KEYS[6]]: z.array(z.nativeEnum(ACTIVITY)),
  [FILTER_KEYS[7]]: z.array(z.nativeEnum(SUB_ACTIVITIES)),
  [FILTER_KEYS[8]]: z.array(z.number()).length(2),
  [FILTER_KEYS[9]]: z.array(z.number()).length(2),
});

export const INITIAL_FILTERS_STATE: z.infer<typeof filtersSchema> = {
  keyword: "",
  projectSizeFilter: PROJECT_SIZE_FILTER.MEDIUM,
  priceType: PROJECT_PRICE_TYPE.MARKET_PRICE,
  costRangeSelector: COST_TYPE_SELECTOR.NPV,
  countryCode: "",
  ecosystem: [],
  activity: [],
  restorationActivity: [],
  costRange: INITIAL_COST_RANGE[COST_TYPE_SELECTOR.NPV],
  abatementPotentialRange: INITIAL_ABATEMENT_POTENTIAL_RANGE,
};

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

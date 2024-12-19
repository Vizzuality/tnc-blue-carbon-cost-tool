import { MapMouseEvent } from "react-map-gl";

import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from "@shared/entities/projects.entity";
import { atom } from "jotai";
import { z } from "zod";

import { filtersSchema } from "@/app/(overview)/url-store";

export const projectsUIState = atom<{
  filtersOpen: boolean;
}>({
  filtersOpen: false,
});

export const popupAtom = atom<{
  lngLat: MapMouseEvent["lngLat"];
  features: MapMouseEvent["features"];
} | null>(null);

export const projectDetailsAtom = atom<{
  isOpen: boolean;
  id: string;
  visibleProjectIds: string[];
}>({
  isOpen: false,
  id: "",
  visibleProjectIds: [],
});

export type ProjectDetailsFilters = Pick<
  z.infer<typeof filtersSchema>,
  "projectSizeFilter" | "priceType" | "costRangeSelector"
>;

const INITIAL_FILTERS_STATE: ProjectDetailsFilters = {
  projectSizeFilter: PROJECT_SIZE_FILTER.MEDIUM,
  priceType: PROJECT_PRICE_TYPE.MARKET_PRICE,
  costRangeSelector: COST_TYPE_SELECTOR.NPV,
};

export const projectDetailsFiltersAtom = atom(INITIAL_FILTERS_STATE);

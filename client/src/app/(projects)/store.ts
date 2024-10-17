import { atom } from "jotai";

import { PROJECT_PARAMETERS } from "@/containers/projects/header/parameters";

export const projectsUIState = atom<{
  filtersOpen: boolean;
  mapExpanded: "default" | "expanded" | "collapsed";
  tableExpanded: "default" | "expanded" | "collapsed";
}>({
  filtersOpen: false,
  mapExpanded: "default",
  tableExpanded: "default",
});

export const projectsFiltersState = atom<{
  keyword: string | undefined;
  projectSize: (typeof PROJECT_PARAMETERS)[0]["options"][number]["value"];
  carbonPricingType: (typeof PROJECT_PARAMETERS)[1]["options"][number]["value"];
  cost: (typeof PROJECT_PARAMETERS)[2]["options"][number]["value"];
}>({
  keyword: undefined,
  projectSize: "medium",
  carbonPricingType: "market_price",
  cost: "npv",
});

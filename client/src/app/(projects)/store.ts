import { atom } from "jotai";

export const projectsUIState = atom<{
  navOpen: boolean;
  filtersOpen: boolean;
  mapExpanded: "default" | "expanded" | "collapsed";
  tableExpanded: "default" | "expanded" | "collapsed";
}>({
  navOpen: false,
  filtersOpen: false,
  mapExpanded: "default",
  tableExpanded: "default",
});

import { atom } from "jotai";

export const projectsUIState = atom<{
  filtersOpen: boolean;
  mapExpanded: "default" | "expanded" | "collapsed";
  tableExpanded: "default" | "expanded" | "collapsed";
}>({
  filtersOpen: false,
  mapExpanded: "default",
  tableExpanded: "default",
});

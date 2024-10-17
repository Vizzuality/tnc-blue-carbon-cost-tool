import { atom } from "jotai";

export const mainNavOpenAtom = atom(false);
export const filtersProjectOpenAtom = atom(false);

export const mapExpandedAtom = atom(false);
export const tableExpandedAtom = atom(false);

export const projectsUIState = atom({
  navOpen: false,
  filtersOpen: false,
  mapExpanded: false,
  tableExpanded: false,
});

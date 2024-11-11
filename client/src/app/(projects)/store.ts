import { atom } from "jotai";

export const projectsUIState = atom<{
  filtersOpen: boolean;
}>({
  filtersOpen: false,
});

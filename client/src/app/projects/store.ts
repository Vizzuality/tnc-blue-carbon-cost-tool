import { atom } from "jotai";

export const projectsUIState = atom<{
  projectSummaryOpen: boolean;
}>({
  projectSummaryOpen: false,
});
export const showCostDetailsAtom = atom<boolean>(false);

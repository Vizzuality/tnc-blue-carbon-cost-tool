import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { atom } from "jotai";

export const projectsUIState = atom<{
  projectSummaryOpen: boolean;
}>({
  projectSummaryOpen: false,
});
export const showCostDetailsAtom = atom<boolean>(false);
export const costDetailsFilterAtom = atom<COST_TYPE_SELECTOR>(
  COST_TYPE_SELECTOR.TOTAL,
);

import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { atom } from "jotai";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { CASH_FLOW_VIEWS } from "@/containers/projects/custom-project/annual-project-cash-flow/header/tabs";

export const projectsUIState = atom<{
  projectSummaryOpen: boolean;
}>({
  projectSummaryOpen: false,
});
export const showCostDetailsAtom = atom<boolean>(false);
export const costDetailsFilterAtom = atom<COST_TYPE_SELECTOR>(
  COST_TYPE_SELECTOR.TOTAL,
);

export function useProjectCashFlowTab() {
  return useQueryState(
    "cashflowTab",
    parseAsStringLiteral(CASH_FLOW_VIEWS).withDefault("chart"),
  );
}

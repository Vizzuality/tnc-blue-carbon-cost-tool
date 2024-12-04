import { atom } from "jotai";
import { parseAsStringLiteral, useQueryState } from "nuqs";

import { CASH_FLOW_VIEWS } from "@/containers/projects/custom-project/annual-project-cash-flow/header/tabs";

export const projectsUIState = atom<{
  projectSummaryOpen: boolean;
}>({
  projectSummaryOpen: false,
});
export const showCostDetailsAtom = atom<boolean>(false);

export function useProjectCashFlowView() {
  return useQueryState(
    "cashflow",
    parseAsStringLiteral(CASH_FLOW_VIEWS).withDefault("chart"),
  );
}

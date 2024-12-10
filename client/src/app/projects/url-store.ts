import { parseAsStringLiteral, useQueryState } from "nuqs";

import { CASH_FLOW_VIEWS } from "@/containers/projects/custom-project/annual-project-cash-flow/header/tabs";

export function useProjectCashFlowTab() {
  return useQueryState(
    "cashflowTab",
    parseAsStringLiteral(CASH_FLOW_VIEWS).withDefault("chart"),
  );
}

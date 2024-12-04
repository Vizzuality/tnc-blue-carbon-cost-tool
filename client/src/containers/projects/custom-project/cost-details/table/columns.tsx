import { createColumnHelper } from "@tanstack/react-table";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

const columnHelper = createColumnHelper<CostItem>();

export const columns = [
  columnHelper.accessor("label", {
    enableSorting: true,
    header: () => <span>Cost estimates</span>,
  }),
  columnHelper.accessor("value", {
    enableSorting: true,
    header: () => <span>Cost $/tCo2</span>,
  }),
  columnHelper.accessor("value", {
    enableSorting: true,
    header: () => <span>Sensitive analysis</span>,
  }),
];

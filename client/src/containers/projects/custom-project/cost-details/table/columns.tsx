import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<{
  costName: string;
  label: string;
  value: string;
}>();

export const columns = [
  columnHelper.accessor("label", {
    enableSorting: true,
    header: () => <span>Cost estimates</span>,
  }),
  columnHelper.accessor("value", {
    enableSorting: true,
    header: () => <span>Cost $/tCo2</span>,
  }),
];

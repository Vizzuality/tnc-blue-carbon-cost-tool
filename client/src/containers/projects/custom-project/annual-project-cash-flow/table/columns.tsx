import { YearlyBreakdownCostName } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { createColumnHelper } from "@tanstack/react-table";

import { formatCurrency } from "@/lib/format";

import { cashflowConfig } from "@/containers/projects/custom-project/annual-project-cash-flow/utils";

interface CostValues {
  [key: string]: number;
}

interface TableRow {
  costName: string;
  totalCost: number;
  totalNPV: number;
  costValues: CostValues;
}

const columnHelper = createColumnHelper<TableRow>();

export const columns = (years: number[]) => [
  columnHelper.accessor("costName", {
    header: () => <span>Project</span>,
    cell: (info) => (
      <span>
        {cashflowConfig[info.getValue() as YearlyBreakdownCostName].label}
      </span>
    ),
  }),
  ...years.map((year) =>
    columnHelper.accessor(`costValues.${year}`, {
      header: () => <span>{year}</span>,
      cell: (info) => (
        <span className="text-center">
          {formatCurrency(info.getValue(), { maximumFractionDigits: 0 })}
        </span>
      ),
    }),
  ),
];

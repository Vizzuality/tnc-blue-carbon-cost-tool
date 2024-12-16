import { createColumnHelper } from "@tanstack/react-table";

import CellValue from "@/containers/projects/form/cell-value";

import { Label } from "@/components/ui/label";

export type RestorationPlanFormProperty = {
  year: number;
  annualHectaresRestored: number;
};

const columnHelper = createColumnHelper<RestorationPlanFormProperty>();

export const COLUMNS = [
  columnHelper.accessor("year", {
    header: () => <span>Year</span>,
    cell: (props) => {
      return <Label>{props.getValue()}</Label>;
    },
  }),
  columnHelper.accessor("annualHectaresRestored", {
    header: () => (
      <span className="flex justify-end">Annual hectares restored / year</span>
    ),
    cell: (props) => (
      <CellValue
        className="relative after:absolute after:right-6 after:top-1/2 after:inline-block after:-translate-y-1/2 after:text-sm after:text-muted-foreground after:content-['ha']"
        // @ts-expect-error fix later
        name={`parameters.restorationYearlyBreakdown.${props.row.original.year === -1 ? 0 : props.row.original.year}`}
        hasUnit
      />
    ),
    maxSize: 55,
  }),
];

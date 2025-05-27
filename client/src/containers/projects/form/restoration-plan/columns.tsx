import { RestorationPlanDto } from "@shared/dtos/custom-projects/restoration-plan.dto";
import { createColumnHelper } from "@tanstack/react-table";

import CellValue from "@/containers/projects/form/cell-value";

import { Label } from "@/components/ui/label";

export type RestorationPlanData = Omit<
  RestorationPlanDto,
  "annualHectaresRestored"
> & {
  defaultAnnualHectaresRestored: RestorationPlanDto["annualHectaresRestored"];
  annualHectaresRestored:
    | RestorationPlanDto["annualHectaresRestored"]
    | undefined;
};

const columnHelper = createColumnHelper<RestorationPlanData>();

export const COLUMNS = [
  columnHelper.accessor("year", {
    header: () => <span>Year</span>,
    cell: (props) => {
      return <Label>{props.getValue()}</Label>;
    },
  }),
  columnHelper.accessor("defaultAnnualHectaresRestored", {
    header: () => <span>Default value</span>,
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor("annualHectaresRestored", {
    header: () => <span>Annual hectares restored / year</span>,
    cell: (props) => {
      const name = `parameters.restorationYearlyBreakdown.${props.row.original.year === -1 ? 0 : props.row.original.year}`;
      return (
        <CellValue
          key={name}
          className="relative after:absolute after:right-6 after:top-1/2 after:inline-block after:-translate-y-1/2 after:text-sm after:text-muted-foreground after:content-['ha']"
          // @ts-expect-error fix later
          name={name}
          hasUnit
        />
      );
    },
    maxSize: 115,
  }),
];

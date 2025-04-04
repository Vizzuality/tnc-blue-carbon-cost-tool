import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { createColumnHelper } from "@tanstack/react-table";

import CellValue from "@/containers/projects/form/cell-value";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import {
  formatCellValue,
  shouldFormatToPercentage,
} from "@/containers/projects/utils";

import { Label } from "@/components/ui/label";

export type AssumptionsFormProperty =
  `assumption.${keyof NonNullable<CustomProjectForm["assumptions"]>}`;

const columnHelper = createColumnHelper<
  DataColumnDef<AssumptionsFormProperty> & {
    tooltipContent: React.ReactNode | string;
  }
>();

export const COLUMNS = [
  columnHelper.accessor("label", {
    header: () => <span>Cost</span>,
    cell: (props) => {
      return (
        <Label
          tooltip={{
            title: props.getValue(),
            content: props.row.original.tooltipContent,
          }}
        >
          {props.getValue()}
        </Label>
      );
    },
  }),
  columnHelper.accessor("defaultValue", {
    header: () => <span>Default value</span>,
    cell: formatCellValue,
  }),
  columnHelper.accessor("unit", {
    header: () => <span>Unit</span>,
  }),
  columnHelper.accessor("value", {
    header: () => <span>Override value</span>,
    cell: (props) => (
      <CellValue
        key={props.row.original.property}
        name={
          props.row.original.property as keyof CustomProjectForm["assumptions"]
        }
        isPercentage={shouldFormatToPercentage(props.row.original.unit)}
      />
    ),
  }),
];

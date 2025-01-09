import { createColumnHelper } from "@tanstack/react-table";

import { formatNumber, toPercentageValue } from "@/lib/format";

import CellValue from "@/containers/projects/form/cell-value";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Label } from "@/components/ui/label";

export type AssumptionsFormProperty =
  `assumption.${keyof NonNullable<CreateCustomProjectForm["assumptions"]>}`;

const columnHelper =
  createColumnHelper<DataColumnDef<AssumptionsFormProperty>>();

export const COLUMNS = [
  columnHelper.accessor("label", {
    header: () => <span>Cost</span>,
    cell: (props) => {
      return (
        <Label
          tooltip={{
            title: props.getValue(),
            // todo: update with descriptions
            content: props.getValue(),
          }}
        >
          {props.getValue()}
        </Label>
      );
    },
  }),
  columnHelper.accessor("defaultValue", {
    header: () => <span>Base value</span>,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined) {
        return "-";
      }

      if (!Number(value)) return value;

      if (props.row.original.unit.includes("%")) {
        return toPercentageValue(Number(value));
      }

      return formatNumber(Number(value));
    },
  }),
  columnHelper.accessor("unit", {
    header: () => <span>Unit</span>,
  }),
  columnHelper.accessor("value", {
    header: () => <span>Override value</span>,
    cell: (props) => (
      <CellValue
        name={
          props.row.original
            .property as keyof CreateCustomProjectForm["assumptions"]
        }
        isPercentage={props.row.original.unit.includes("%")}
      />
    ),
  }),
];

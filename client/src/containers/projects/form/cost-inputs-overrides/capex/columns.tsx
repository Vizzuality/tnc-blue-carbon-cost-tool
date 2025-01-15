import React from "react";

import { createColumnHelper } from "@tanstack/react-table";

import CellValue from "@/containers/projects/form/cell-value";
import {
  COST_INPUTS_KEYS,
  DataColumnDef,
} from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CustomProjectForm } from "@/containers/projects/form/setup";
import {
  formatCellValue,
  shouldFormatToPercentage,
} from "@/containers/projects/utils";

import { Label } from "@/components/ui/label";

export type CapexFormProperty =
  `costInputs.${(typeof COST_INPUTS_KEYS)["capex"][number]}`;

const columnHelper = createColumnHelper<DataColumnDef<CapexFormProperty>>();

export const COLUMNS = [
  columnHelper.accessor("label", {
    header: () => <span>Capex</span>,
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
    cell: formatCellValue,
  }),
  columnHelper.accessor("unit", {
    header: () => <span>Unit</span>,
  }),
  columnHelper.accessor("value", {
    header: () => <span>Override value</span>,
    cell: (props) => {
      return (
        <CellValue
          name={
            props.row.original.property as keyof CustomProjectForm["costInputs"]
          }
          isPercentage={shouldFormatToPercentage(props.row.original.unit)}
        />
      );
    },
  }),
];

import React from "react";

import { createColumnHelper } from "@tanstack/react-table";

import { formatNumber } from "@/lib/format";

import CellValue from "@/containers/projects/form/cell-value";
import {
  COST_INPUTS_KEYS,
  DataColumnDef,
} from "@/containers/projects/form/cost-inputs-overrides/constants";
import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

import { Label } from "@/components/ui/label";

export type OpexFormProperty =
  `costInputs.${(typeof COST_INPUTS_KEYS)["opex"][number]}`;

const columnHelper = createColumnHelper<DataColumnDef<OpexFormProperty>>();

export const COLUMNS = [
  columnHelper.accessor("label", {
    header: () => <span>Opex</span>,
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
    header: () => null,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined) {
        return "-";
      }

      if (!Number(value)) return value;

      return formatNumber(Number(value));
    },
  }),
  columnHelper.accessor("unit", {
    header: () => null,
  }),
  columnHelper.accessor("value", {
    header: () => null,
    cell: (props) => {
      return (
        <CellValue
          name={
            props.row.original
              .property as keyof CreateCustomProjectForm["costInputs"]
          }
        />
      );
    },
  }),
];

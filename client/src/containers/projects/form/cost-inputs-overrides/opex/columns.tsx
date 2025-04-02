import React from "react";

import { COST_INPUTS_KEYS } from "@shared/dtos/custom-projects/custom-projects.constants";
import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";
import { createColumnHelper } from "@tanstack/react-table";

import CellValue from "@/containers/projects/form/cell-value";
import { DataColumnDef } from "@/containers/projects/form/cost-inputs-overrides/constants";
import {
  formatCellValue,
  shouldFormatToPercentage,
} from "@/containers/projects/utils";

import { Label } from "@/components/ui/label";

export type OpexFormProperty =
  `costInputs.${(typeof COST_INPUTS_KEYS)["opex"][number]}`;

const columnHelper = createColumnHelper<
  DataColumnDef<OpexFormProperty> & {
    tooltipContent: React.ReactNode | string;
  }
>();

export const COLUMNS = [
  columnHelper.accessor("label", {
    header: () => <span>Opex</span>,
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
    header: () => null,
    cell: formatCellValue,
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
            props.row.original.property as keyof CustomProjectForm["costInputs"]
          }
          isPercentage={shouldFormatToPercentage(props.row.original.unit)}
        />
      );
    },
  }),
];

import { ProjectType } from "@shared/contracts/projects.contract";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { formatCurrency, formatNumber } from "@/lib/format";

import { filtersSchema } from "@/app/(overview)/url-store";

import { TableStateWithMaximums } from "@/containers/overview/table/view/overview";

import SingleStackedBarChart from "@/components/ui/bar-chart/single-stacked-bar-chart";
import { DEFAULT_BG_CLASSES, ScoreIndicator } from "@/components/ui/score-card";

const columnHelper = createColumnHelper<
  Partial<ProjectType> & {
    capex?: number;
    opex?: number;
    capexNPV?: number;
    opexNPV?: number;
    totalCostNPV?: number;
  }
>();

const createSegments = (
  type: COST_TYPE_SELECTOR,
  projectName: string,
  rowData: {
    capexNPV?: number;
    opexNPV?: number;
    capex?: number;
    opex?: number;
  },
) => {
  const values = {
    capex:
      type === COST_TYPE_SELECTOR.NPV
        ? (rowData.capexNPV ?? 0)
        : (rowData.capex ?? 0),
    opex:
      type === COST_TYPE_SELECTOR.NPV
        ? (rowData.opexNPV ?? 0)
        : (rowData.opex ?? 0),
  };

  return [
    {
      id: `segment-${type}-${projectName}-${values.capex}`,
      value: values.capex,
      colorClass: "bg-sky-blue-500",
    },
    {
      id: `segment-${type}-${projectName}-${values.opex}`,
      value: values.opex,
      colorClass: "bg-sky-blue-200",
    },
  ];
};

export const columns = (filters: z.infer<typeof filtersSchema>) => [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  columnHelper.accessor("scoreCardRating", {
    enableSorting: true,
    header: () => <span>Scorecard rating</span>,
    cell: (props) => {
      const value = props.getValue();
      if (value === undefined) {
        return "-";
      }
      return (
        <ScoreIndicator className={DEFAULT_BG_CLASSES[value as PROJECT_SCORE]}>
          {value}
        </ScoreIndicator>
      );
    },
  }),
  columnHelper.accessor(
    filters.costRangeSelector === "npv" ? "costPerTCO2eNPV" : "costPerTCO2e",
    {
      enableSorting: true,
      header: () => <span>Cost $(USD)/tCo2</span>,
      cell: (props) => {
        const value = props.getValue();
        if (value === null || value === undefined) {
          return "-";
        }

        return formatCurrency(value);
      },
    },
  ),
  columnHelper.accessor("abatementPotential", {
    enableSorting: true,
    header: () => <span>Abatement potential</span>,
    cell: (props) => {
      const value = props.getValue();
      if (value === null || value === undefined) {
        return "-";
      }
      const state = props.table.getState() as TableStateWithMaximums;

      return (
        <div className="flex items-center gap-2">
          <SingleStackedBarChart
            total={{
              id: `total-${props.row.original.projectName}-${value}`,
              value: state.maximums?.maxAbatementPotential ?? 0,
              colorClass: "bg-sky-blue-950",
            }}
            segments={[
              {
                id: `segment-${props.row.original.projectName}-${value}`,
                value: props.getValue() ?? 0,
                colorClass: "bg-green",
              },
            ]}
          />
          <p className="text-sm font-normal">{formatNumber(value)}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor(
    filters.costRangeSelector === "npv" ? "totalCostNPV" : "totalCost",
    {
      enableSorting: true,
      header: () => <span>Total Cost (CapEx + OpEx)</span>,
      cell: (props) => {
        const value = props.getValue();
        if (value === null || value === undefined) {
          return "-";
        }

        const state = props.table.getState() as TableStateWithMaximums;

        return (
          <div className="flex items-center gap-2">
            <SingleStackedBarChart
              total={{
                id: `total-${props.row.original.projectName}-${value}`,
                value: state.maximums?.maxCost ?? 0,
                colorClass: "bg-sky-blue-950",
              }}
              segments={createSegments(
                COST_TYPE_SELECTOR.NPV,
                props.row.original.projectName ?? "project",
                props.row.original,
              )}
            />
            <p className="text-sm font-normal">{formatNumber(value)}</p>
          </div>
        );
      },
    },
  ),
];

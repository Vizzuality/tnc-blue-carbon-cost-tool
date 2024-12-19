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

const HeaderText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-normal">{children}</span>
);
const CellText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm font-normal">{children}</span>
);

export const columns = (filters: z.infer<typeof filtersSchema>) => [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <HeaderText>Project Name</HeaderText>,
  }),
  columnHelper.accessor("scoreCardRating", {
    enableSorting: true,
    header: () => <HeaderText>Scorecard rating</HeaderText>,
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
      header: () => <HeaderText>Cost $(USD)/tCo2</HeaderText>,
      cell: (props) => {
        const value = props.getValue();
        if (value === null || value === undefined) {
          return "-";
        }

        return <CellText>{formatCurrency(value)}</CellText>;
      },
    },
  ),
  columnHelper.accessor("abatementPotential", {
    enableSorting: true,
    header: () => <HeaderText>Abatement potential (tCO2e/yr)</HeaderText>,
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
          <CellText>{formatNumber(value)}</CellText>
        </div>
      );
    },
  }),
  columnHelper.accessor(
    filters.costRangeSelector === "npv" ? "totalCostNPV" : "totalCost",
    {
      enableSorting: true,
      header: () => (
        <HeaderText>
          Total Cost (<span className="text-sky-blue-500">CapEx</span>
          &nbsp;+&nbsp;
          <span className="text-sky-blue-200">OpEx</span>)
        </HeaderText>
      ),
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
                value:
                  state.maximums?.maxTotalCost[filters.costRangeSelector] ?? 0,
                colorClass: "bg-sky-blue-950",
              }}
              segments={createSegments(
                filters.costRangeSelector,
                props.row.original.projectName ?? "project",
                props.row.original,
              )}
            />
            <CellText>{formatNumber(value)}</CellText>
          </div>
        );
      },
    },
  ),
];

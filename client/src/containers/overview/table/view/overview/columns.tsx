import { ProjectType } from "@shared/contracts/projects.contract";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { formatCurrency, formatNumber } from "@/lib/format";

import { filtersSchema } from "@/app/(overview)/url-store";

import { DEFAULT_BG_CLASSES, ScoreIndicator } from "@/components/ui/score-card";

const columnHelper = createColumnHelper<Partial<ProjectType>>();

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

      return formatNumber(value);
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

        return formatNumber(value);
      },
    },
  ),
];

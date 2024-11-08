import { ProjectType } from "@shared/contracts/projects.contract";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { filtersSchema } from "@/app/(projects)/url-store";

const columnHelper = createColumnHelper<Partial<ProjectType>>();

export const columns = (filters: z.infer<typeof filtersSchema>) => [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  // ! omitting until is available in the API
  // columnHelper.accessor("scorecard", {
  //   enableSorting: true,
  //   header: () => <span>Scorecard rating</span>,
  // }),
  columnHelper.accessor(
    filters.totalCost === "npv" ? "costPerTCO2eNPV" : "costPerTCO2e",
    {
      enableSorting: true,
      header: () => <span>Cost $/tCo2</span>,
    },
  ),
  columnHelper.accessor("abatementPotential", {
    enableSorting: true,
    header: () => <span>Abatement potential</span>,
  }),
  columnHelper.accessor(
    filters.totalCost === "npv" ? "totalCostNPV" : "totalCost",
    {
      enableSorting: true,
      header: () => <span>Total Cost (CapEx + OpEx)</span>,
    },
  ),
];

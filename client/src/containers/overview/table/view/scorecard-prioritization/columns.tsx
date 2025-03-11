import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { CellContext, createColumnHelper } from "@tanstack/react-table";

import { renderHeader } from "@/containers/overview/table/utils";

import { ScoreIndicator } from "@/components/ui/score-card";
const columnHelper = createColumnHelper<ProjectScorecardView>();

const renderCell = (
  props: CellContext<ProjectScorecardView, PROJECT_SCORE>,
) => {
  return <ScoreIndicator value={props.getValue()} className="min-h-[56px]" />;
};

export const TABLE_COLUMNS = [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: renderHeader("Project Name"),
  }),
  columnHelper.accessor("scoreCardRating", {
    enableSorting: true,
    header: renderHeader("Scorecard rating"),
    cell: renderCell,
  }),
  columnHelper.accessor("financialFeasibility", {
    enableSorting: true,
    header: renderHeader("Financial feasibility"),
    cell: renderCell,
  }),
  columnHelper.accessor("legalFeasibility", {
    enableSorting: true,
    header: renderHeader("Legal feasibility"),
    cell: renderCell,
  }),
  columnHelper.accessor("implementationFeasibility", {
    enableSorting: true,
    header: renderHeader("Implementation feasibility"),
    cell: renderCell,
  }),
  columnHelper.accessor("socialFeasibility", {
    enableSorting: true,
    header: renderHeader("Social feasibility"),
    cell: renderCell,
  }),
  columnHelper.accessor("securityRating", {
    enableSorting: true,
    header: renderHeader("Security rating"),
    cell: renderCell,
  }),
  columnHelper.accessor("availabilityOfExperiencedLabor", {
    enableSorting: true,
    header: renderHeader("Availability of experienced labor"),
    cell: renderCell,
  }),
  columnHelper.accessor("availabilityOfAlternatingFunding", {
    enableSorting: true,
    header: renderHeader("Availability of alternating funding"),
    cell: renderCell,
  }),
  columnHelper.accessor("coastalProtectionBenefits", {
    enableSorting: true,
    header: renderHeader("Coastal Protection benefit"),
    cell: renderCell,
  }),
  columnHelper.accessor("biodiversityBenefit", {
    enableSorting: true,
    header: renderHeader("Biodiversity benefit"),
    cell: renderCell,
  }),
];

import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { createColumnHelper } from "@tanstack/react-table";

import { Score } from "@/components/ui/score-card";
import { ScoreIndicator } from "@/components/ui/score-card";

const columnHelper = createColumnHelper<ProjectScorecardView>();

export const TABLE_COLUMNS = [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  columnHelper.accessor("financialFeasibility", {
    enableSorting: true,
    header: () => <span>Financial feasibility</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("legalFeasibility", {
    enableSorting: true,
    header: () => <span>Legal Feasibility</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("implementationFeasibility", {
    enableSorting: true,
    header: () => <span>Implementation feasibility</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("socialFeasibility", {
    enableSorting: true,
    header: () => <span>Social Feasibility</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("securityRating", {
    enableSorting: true,
    header: () => <span>Security Rating</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("availabilityOfExperiencedLabor", {
    enableSorting: true,
    header: () => <span>Availability of experienced labor</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("availabilityOfAlternatingFunding", {
    enableSorting: true,
    header: () => <span>Availability of alternating funding</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("coastalProtectionBenefits", {
    enableSorting: true,
    header: () => <span>Coastal Protection benefit</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
  columnHelper.accessor("biodiversityBenefit", {
    enableSorting: true,
    header: () => <span>Biodiversity benefit</span>,
    cell: (props) => <ScoreIndicator score={props.getValue() as Score} />,
  }),
];

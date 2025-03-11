import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { createColumnHelper } from "@tanstack/react-table";

import { ScoreIndicator } from "@/components/ui/score-card";

const columnHelper = createColumnHelper<ProjectScorecardView>();

export const TABLE_COLUMNS = [
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
      return <ScoreIndicator value={value as PROJECT_SCORE} />;
    },
  }),
  columnHelper.accessor("financialFeasibility", {
    enableSorting: true,
    header: () => <span>Financial feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.financialFeasibility as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("legalFeasibility", {
    enableSorting: true,
    header: () => <span>Legal Feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.legalFeasibility as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("implementationFeasibility", {
    enableSorting: true,
    header: () => <span>Implementation feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.implementationFeasibility as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("socialFeasibility", {
    enableSorting: true,
    header: () => <span>Social Feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.socialFeasibility as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("securityRating", {
    enableSorting: true,
    header: () => <span>Security Rating</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.securityRating as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("availabilityOfExperiencedLabor", {
    enableSorting: true,
    header: () => <span>Availability of experienced labor</span>,
    cell: (props) => (
      <ScoreIndicator
        value={
          props.row.original.availabilityOfExperiencedLabor as PROJECT_SCORE
        }
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("availabilityOfAlternatingFunding", {
    enableSorting: true,
    header: () => <span>Availability of alternating funding</span>,
    cell: (props) => (
      <ScoreIndicator
        value={
          props.row.original.availabilityOfAlternatingFunding as PROJECT_SCORE
        }
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("coastalProtectionBenefits", {
    enableSorting: true,
    header: () => <span>Coastal Protection benefit</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.coastalProtectionBenefits as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
  columnHelper.accessor("biodiversityBenefit", {
    enableSorting: true,
    header: () => <span>Biodiversity benefit</span>,
    cell: (props) => (
      <ScoreIndicator
        value={props.row.original.biodiversityBenefit as PROJECT_SCORE}
        className="min-h-[56px]"
      />
    ),
  }),
];

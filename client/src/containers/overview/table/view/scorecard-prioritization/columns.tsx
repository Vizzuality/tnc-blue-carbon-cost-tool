import { createColumnHelper } from "@tanstack/react-table";
import { ScoreIndicator } from "@/components/ui/score-card";
import { ProjectScorecard } from "@shared/entities/project-scorecard.entity";

const columnHelper = createColumnHelper<
  Partial<ProjectScorecard> & {
    financialFeasibility: number;
    legalFeasibility: number;
    implementationFeasibility: number;
    socialFeasibility: number;
    securityRating: number;
    availabilityOfExperiencedLabor: number;
    availabilityOfAlternatingFunding: number;
    coastalProtectionBenefit: number;
    biodiversityBenefit: number;
  }
>();

export const TABLE_COLUMNS = [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  columnHelper.accessor("financialFeasibility", {
    enableSorting: true,
    header: () => <span>Financial feasibility</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("legalFeasibility", {
    enableSorting: true,
    header: () => <span>Legal Feasibility</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("implementationFeasibility", {
    enableSorting: true,
    header: () => <span>Implementation feasibility</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("socialFeasibility", {
    enableSorting: true,
    header: () => <span>Social Feasibility</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("securityRating", {
    enableSorting: true,
    header: () => <span>Security Rating</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("availabilityOfExperiencedLabor", {
    enableSorting: true,
    header: () => <span>Availability of experienced labor</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("availabilityOfAlternatingFunding", {
    enableSorting: true,
    header: () => <span>Availability of alternating funding</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("coastalProtectionBenefit", {
    enableSorting: true,
    header: () => <span>Coastal Protection benefit</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
  columnHelper.accessor("biodiversityBenefit", {
    enableSorting: true,
    header: () => <span>Biodiversity benefit</span>,
    cell: (props) => {
      const value = props.getValue();
      return <ScoreIndicator score={value as "high" | "medium" | "low"} />;
    },
  }),
];

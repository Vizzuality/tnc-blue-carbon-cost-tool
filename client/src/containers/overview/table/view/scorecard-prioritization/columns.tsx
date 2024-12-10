import { PROJECT_SCORE } from "@shared/entities/project-score.enum";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { createColumnHelper } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { ScoreIndicator, DEFAULT_BG_CLASSES } from "@/components/ui/score-card";

const columnHelper = createColumnHelper<ProjectScorecardView>();

export const TABLE_COLUMNS = [
  columnHelper.accessor("projectName", {
    enableSorting: true,
    header: () => <span>Project Name</span>,
  }),
  columnHelper.accessor("financialFeasibility", {
    enableSorting: true,
    header: () => <span>Financial feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.financialFeasibility as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.financialFeasibility}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("legalFeasibility", {
    enableSorting: true,
    header: () => <span>Legal Feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.legalFeasibility as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.legalFeasibility}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("implementationFeasibility", {
    enableSorting: true,
    header: () => <span>Implementation feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.implementationFeasibility as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.implementationFeasibility}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("socialFeasibility", {
    enableSorting: true,
    header: () => <span>Social Feasibility</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.socialFeasibility as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.socialFeasibility}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("securityRating", {
    enableSorting: true,
    header: () => <span>Security Rating</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.securityRating as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.securityRating}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("availabilityOfExperiencedLabor", {
    enableSorting: true,
    header: () => <span>Availability of experienced labor</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.availabilityOfExperiencedLabor as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.availabilityOfExperiencedLabor}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("availabilityOfAlternatingFunding", {
    enableSorting: true,
    header: () => <span>Availability of alternating funding</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.availabilityOfAlternatingFunding as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.availabilityOfAlternatingFunding}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("coastalProtectionBenefits", {
    enableSorting: true,
    header: () => <span>Coastal Protection benefit</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.coastalProtectionBenefits as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.coastalProtectionBenefits}
      </ScoreIndicator>
    ),
  }),
  columnHelper.accessor("biodiversityBenefit", {
    enableSorting: true,
    header: () => <span>Biodiversity benefit</span>,
    cell: (props) => (
      <ScoreIndicator
        className={cn(
          "min-h-[56px]",
          DEFAULT_BG_CLASSES[
            props.row.original.biodiversityBenefit as PROJECT_SCORE
          ],
        )}
      >
        {props.row.original.biodiversityBenefit}
      </ScoreIndicator>
    ),
  }),
];

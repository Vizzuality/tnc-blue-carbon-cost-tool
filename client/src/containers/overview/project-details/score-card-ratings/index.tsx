import { FC } from "react";

import { Scorecard } from "@shared/dtos/projects/project-scorecard.dto";
import { PROJECT_SCORE } from "@shared/entities/project-score.enum";

import { useFeatureFlags } from "@/hooks/use-feature-flags";

import CompareButton from "@/containers/overview/project-details/compare-button";

import { Label } from "@/components/ui/label";
import { ScoreIndicator } from "@/components/ui/score-card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const scoreCardMap = {
  financialFeasibility: "Economic feasibility",
  legalFeasibility: "Legal feasibility",
  implementationFeasibility: "Implementation risk",
  socialFeasibility: "Social feasibility",
  securityRating: "Security risk",
  availabilityOfExperiencedLabor: "Availability of experienced labor",
  availabilityOfAlternatingFunding: "Alt. funding access",
  coastalProtectionBenefits: "Coastal protection benefits",
  biodiversityBenefit: "Biodiversity benefit",
};

const ScoreCardRatings: FC<{ data?: Scorecard }> = ({ data }) => {
  const { "compare-with-other-project": compareWithOtherProject } =
    useFeatureFlags();
  return (
    <>
      <div className="flex items-center justify-between py-2 pl-4 pr-2">
        <div className="flex items-center gap-2">
          <Label
            className="text-md font-medium"
            tooltip={{
              title: "Scorecard ratings",
              content:
                "Refers to the summary of Capital Expenditure and Operating Expenditure",
            }}
          >
            <h3 className="text-base font-semibold">Scorecard ratings</h3>
          </Label>
        </div>
        {compareWithOtherProject && <CompareButton />}
      </div>
      <Table>
        <TableBody>
          {data &&
            Object.entries(data).map(([key, value]) => (
              <TableRow
                key={`scorecard-item-${key}`}
                className="divide-background first:border-t"
              >
                <TableCell className="py-2 pl-4 text-sm font-normal text-big-stone-200">
                  {scoreCardMap[key as keyof Scorecard]}
                </TableCell>
                <TableCell className="w-[240px] p-0 font-medium">
                  <ScoreIndicator value={value as PROJECT_SCORE} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ScoreCardRatings;

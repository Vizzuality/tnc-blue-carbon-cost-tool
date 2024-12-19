import { FC } from "react";

import { ProjectScorecardDto } from "@shared/dtos/projects/project-scorecard.dto";
import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { useAtomValue } from "jotai";

import { projectDetailsFiltersAtom } from "@/app/(overview)/store";

import { PROJECT_DETAILS } from "@/constants/tooltip";

import { GraphWithLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

interface ProjectDetailsCostProps {
  data?: ProjectScorecardDto["projectCost"];
}
const ProjectDetailsCost: FC<ProjectDetailsCostProps> = ({ data }) => {
  const { costRangeSelector } = useAtomValue(projectDetailsFiltersAtom);
  const tooltipContent =
    costRangeSelector === COST_TYPE_SELECTOR.NPV
      ? PROJECT_DETAILS.TOTAL_PROJECT_COST_NPV
      : PROJECT_DETAILS.TOTAL_PROJECT_COST;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              className="text-md font-medium"
              tooltip={{
                title: "Total project cost",
                content: tooltipContent,
              }}
            >
              <h3 className="text-md">Total project cost</h3>
            </Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Refers to the summary of Capital Expenditure and Operating
            Expenditure
          </div>
        </div>
      </div>
      <GraphWithLegend
        total={data?.[costRangeSelector].totalCost || 0}
        items={[
          {
            value: data?.[costRangeSelector].capex || 0,
            label: "CapEx",
            textColor: "text-sky-blue-500",
            bgColor: "bg-sky-blue-500",
          },
          {
            value: data?.[costRangeSelector].opex || 0,
            label: "OpEx",
            textColor: "text-sky-blue-200",
            bgColor: "bg-sky-blue-200",
          },
        ]}
      />
    </>
  );
};

export default ProjectDetailsCost;

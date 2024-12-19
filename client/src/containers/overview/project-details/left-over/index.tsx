import { FC } from "react";

import { ProjectScorecardDto } from "@shared/dtos/projects/project-scorecard.dto";
import { useAtomValue } from "jotai";

import { projectDetailsFiltersAtom } from "@/app/(overview)/store";

import { PROJECT_DETAILS } from "@/constants/tooltip";

import { GraphWithLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

interface ProjectDetailsLeftoverProps {
  data?: ProjectScorecardDto["projectCost"];
  leftoverAfterOpex?: number;
}

const ProjectDetailsLeftover: FC<ProjectDetailsLeftoverProps> = ({
  data,
  leftoverAfterOpex,
}) => {
  const { costRangeSelector } = useAtomValue(projectDetailsFiltersAtom);
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              className="text-md font-medium"
              tooltip={{
                title: "Leftover after OpEx",
                content: PROJECT_DETAILS.LEFTOVER_AFTER_OPEX,
              }}
            >
              <h3 className="text-md">Leftover after OpEx</h3>
            </Label>
          </div>
          <div className="text-sm text-big-stone-200">
            Refers to the difference between Total Revenue and Operating
            Expenditure.
          </div>
        </div>
      </div>
      <GraphWithLegend
        total={data?.[costRangeSelector].totalRevenue || 0}
        leftover={leftoverAfterOpex || 0}
        items={[
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

export default ProjectDetailsLeftover;

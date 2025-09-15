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
  const netRevenue =
    (data?.[costRangeSelector].totalRevenue || 0) -
    (data?.[costRangeSelector].opex || 0);
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              className="text-md font-medium"
              tooltip={{
                title: "Net revenue after OPEX",
                content: PROJECT_DETAILS.NET_REVENUE_AFTER_OPEX_TOTAL_COST,
              }}
            >
              <h3 className="text-md">Net revenue after OPEX</h3>
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
        totalCircleClassName="bg-yellow-500"
        totalLabelClassName="text-yellow-500"
        leftover={leftoverAfterOpex || 0}
        items={[
          {
            value: data?.[costRangeSelector].opex || 0,
            label: "OpEx",
            circleClassName: "bg-sky-blue-200",
            labelClassName: "text-sky-blue-200",
          },
          {
            value: netRevenue,
            label: "Net revenue",
            circleClassName: "bg-sky-blue-500",
            labelClassName: "text-sky-blue-500",
          },
        ]}
      />
    </>
  );
};

export default ProjectDetailsLeftover;

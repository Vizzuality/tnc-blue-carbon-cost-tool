import { FC } from "react";

import { useSetAtom } from "jotai";

import { showCostDetailsAtom } from "@/app/projects/store";

import { CUSTOM_PROJECT_OUTPUTS } from "@/constants/tooltip";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraphWithLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

interface ProjectCostProps {
  total: number;
  capex: number;
  opex: number;
}
const ProjectCost: FC<ProjectCostProps> = ({ total, capex, opex }) => {
  const setShowCostDetails = useSetAtom(showCostDetailsAtom);

  return (
    <Card variant="secondary" className="grid flex-1 gap-1 p-0">
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 p-4 pb-0">
        <div>
          <div className="flex items-center gap-2">
            <Label
              className="text-md font-medium"
              tooltip={{
                title: "Total project cost",
                content: CUSTOM_PROJECT_OUTPUTS.TOTAL_PROJECT_COST,
              }}
              asChild
            >
              <h2 className="text-base font-semibold">Total project cost</h2>
            </Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Refers to the summary of Capital Expenditure and Operating
            Expenditure
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowCostDetails(true)}
        >
          Cost details
        </Button>
      </CardHeader>

      <CardContent className="mt-0 flex flex-col justify-end px-4 pb-4">
        <GraphWithLegend
          total={total}
          items={[
            {
              label: "CapEx",
              value: capex,
              circleClassName: "bg-sky-blue-500",
              labelClassName: "text-sky-blue-500",
            },
            {
              label: "OpEx",
              value: opex,
              circleClassName: "bg-sky-blue-200",
              labelClassName: "text-sky-blue-200",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCost;

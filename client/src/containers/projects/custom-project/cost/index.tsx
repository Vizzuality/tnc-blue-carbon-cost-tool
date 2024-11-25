import { FC } from "react";

import { useSetAtom } from "jotai";

import { renderCurrency } from "@/lib/format";

import mockData from "@/containers/projects/custom-project/mock-data";
import { showCostDetailsAtom } from "@/containers/projects/custom-project/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Graph, GraphLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

const ProjectCost: FC = () => {
  const setShowCostDetails = useSetAtom(showCostDetailsAtom);

  return (
    <Card variant="secondary" className="flex-1 p-0">
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0 p-4">
        <div>
          <div className="flex items-center gap-2">
            <Label
              className="text-md font-medium"
              tooltip={{
                title: "Total project cost",
                content:
                  "Refers to the summary of Capital Expenditure and Operating Expenditure",
              }}
              asChild
            >
              <h2 className="text-base font-semibold">Total project cost</h2>
            </Label>
          </div>
          <div className="text-sm text-big-stone-200">
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

      <CardContent className="px-4 pb-4">
        <div className="flex justify-between gap-[100px]">
          <div className="flex max-w-[148px] flex-1 flex-col justify-between">
            <div>
              <span className="text-xl font-normal">
                {renderCurrency(mockData.totalCost)}
              </span>
            </div>
            <GraphLegend
              items={[
                {
                  label: "CapEx",
                  textColor: "text-sky-blue-500",
                  bgColor: "bg-sky-blue-500",
                },
                {
                  label: "OpEx",
                  textColor: "text-sky-blue-200",
                  bgColor: "bg-sky-blue-200",
                },
              ]}
            />
          </div>
          <Graph
            summary={{
              totalCost: mockData.totalCost,
              capEx: {
                value: mockData.capEx,
                label: "CapEx",
                colorClass: "bg-sky-blue-500",
              },
              opEx: {
                value: mockData.opExRevenue,
                label: "OpEx",
                colorClass: "bg-sky-blue-200",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCost;

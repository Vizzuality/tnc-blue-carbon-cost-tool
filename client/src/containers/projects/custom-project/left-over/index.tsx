import { FC } from "react";

import { renderCurrency } from "@/lib/format";

import mockData from "@/containers/projects/custom-project/mock-data";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Graph, GraphLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

const LeftOver: FC = () => {
  return (
    <Card variant="secondary" className="flex-1 p-0">
      <CardHeader className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="totalProjectCost"
              className="text-md font-medium"
              tooltip={{
                title: "Total project cost",
                content:
                  "Refers to the summary of Capital Expenditure and Operating Expenditure",
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
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="flex justify-between gap-[100px]">
          <div className="flex max-w-[148px] flex-1 flex-col justify-between">
            <div>
              <span className="text-xl font-normal">
                {renderCurrency(mockData.leftover)}
              </span>
            </div>
            <GraphLegend
              items={[
                {
                  label: "Total Revenue",
                  textColor: "text-yellow-500",
                  bgColor: "bg-yellow-500",
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
            total={mockData.totalRevenue}
            segments={[
              {
                value: mockData.opExRevenue,
                colorClass: "bg-sky-blue-200",
              },
            ]}
            leftover={mockData.leftover}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeftOver;

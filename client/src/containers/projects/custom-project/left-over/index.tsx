import { FC } from "react";

import { CUSTOM_PROJECT_OUTPUTS } from "@/constants/tooltip";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraphWithLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";

interface LeftoverProps {
  total: number;
  leftover: number;
  opex: number;
}

const LeftOver: FC<LeftoverProps> = ({ total, leftover, opex }) => {
  return (
    <Card variant="secondary" className="flex-1 p-0">
      <CardHeader className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="totalProjectCost"
              className="text-md font-medium"
              tooltip={{
                title: "Leftover after OpEx",
                content: CUSTOM_PROJECT_OUTPUTS.LEFTOVER_AFTER_OPEX,
              }}
            >
              <h3 className="text-md">Leftover after OpEx</h3>
            </Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Refers to the difference between Total Revenue and Operating
            Expenditure.
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <GraphWithLegend
          total={total}
          leftover={leftover}
          items={[
            {
              value: opex,
              label: "OpEx",
              textColor: "text-sky-blue-200",
              bgColor: "bg-sky-blue-200",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default LeftOver;

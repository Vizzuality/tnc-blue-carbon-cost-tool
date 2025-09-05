import { FC } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraphWithLegend } from "@/components/ui/graph";
import { Label } from "@/components/ui/label";
import { CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";

interface LeftoverProps {
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;
  title: string;
  tooltip: {
    title: string;
    content: string;
  };
  data?: {
    total: number;
    leftover: number;
    opex: number;
  };
}

const LeftOver: FC<LeftoverProps> = ({
  data,
  title,
  tooltip,
  carbonRevenuesToCover,
}) => {
  return (
    <Card variant="secondary" className="grid flex-1 gap-1 p-0">
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="totalProjectCost"
              className="text-md font-medium"
              tooltip={tooltip}
            >
              <h3 className="text-md">{title}</h3>
            </Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Refers to the difference between Total Revenue and Operating
            Expenditure.
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-0 flex flex-col justify-end px-4 pb-4">
        {data && (
          <GraphWithLegend
            total={data.total}
            leftover={data.leftover}
            items={[
              {
                value: data.opex,
                label:
                  carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
                    ? "OpEx"
                    : "Total",
                circleClassName: "bg-sky-blue-200",
                labelClassName: "text-sky-blue-200",
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LeftOver;

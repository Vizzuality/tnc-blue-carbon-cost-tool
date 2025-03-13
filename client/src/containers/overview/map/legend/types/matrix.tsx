import React from "react";

import { MAP_LEGEND } from "@/constants/tooltip";

import InfoButton from "@/components/ui/info-button";

export interface LegendMatrixIntersectionsProps {
  intersections: Array<{
    id: number;
    color: string;
  }>;
}

export interface LegendTypeProps {
  className?: HTMLDivElement["className"];
}

export default function MatrixLegend({
  intersections = [],
  colorNumber = 4,
}: LegendTypeProps &
  LegendMatrixIntersectionsProps & { colorNumber?: number }) {
  return (
    <div className="flex gap-3">
      <div>
        <p>Abatement potential and cost</p>
        <InfoButton title="Abatement potential and cost">
          {MAP_LEGEND}
        </InfoButton>
      </div>
      <div className="flex items-center">
        <div className="relative w-20 flex-shrink-0 py-6 pl-5 text-xs font-medium text-muted-foreground">
          <p
            className="font-heading absolute bottom-6 left-0 rotate-180 transform"
            style={{ writingMode: "vertical-rl" }}
          >
            Cost
          </p>
          <p className="font-heading absolute bottom-0 left-1/2 -translate-x-1/2 transform">
            Abatement
          </p>
          <div className="preserve-3d w-full transform">
            <div className="w-full" style={{ paddingBottom: "100%" }}>
              <div className="absolute left-0 top-0 flex h-full w-full flex-wrap">
                {intersections.map((i) => (
                  <div
                    key={i.id}
                    className="relative block"
                    style={{
                      background: `${i.color}`,
                      width: `${100 / colorNumber}%`,
                      height: `${100 / colorNumber}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useCustomProjectOutput } from "@/hooks/use-custom-project-output";
import { cn } from "@/lib/utils";
import * as React from "react";
import { CellText } from "@/containers/overview/table/utils";
import { formatNumber } from "@/lib/format";

export default function SensitivityAnalysisColumn({
  datum,
}: {
  datum: ReturnType<
    typeof useCustomProjectOutput
  >["costDetailsProps"][number]["sensitivityAnalysis"] & {
    scaledNegative: number;
    scaledPositive: number;
  };
}) {
  if (!datum) return null;

  return (
    <div className="flex items-center justify-between gap-1">
      <CellText className="flex flex-1 justify-center text-[#F151B7]">
        {formatNumber(datum?.changePctLower * 100)}%
      </CellText>
      <div
        className={cn("relative flex h-2 w-[140px] shrink-0 bg-sky-blue-950")}
      >
        <div className="relative flex flex-1 shrink-0">
          <div
            className="absolute right-0 h-full bg-[#F151B7]"
            style={{
              width: `${datum.scaledNegative}%`,
            }}
          />
        </div>
        <div className="relative flex flex-1 shrink-0">
          <div
            className="absolute left-0 h-full bg-[#B8EA6D]"
            style={{
              width: `${datum.scaledPositive}%`,
            }}
          />
        </div>
      </div>
      <CellText className="flex flex-1 justify-center text-[#B8EA6D]">
        +{formatNumber(datum?.changePctHigher * 100)}%
      </CellText>
    </div>
  );
}

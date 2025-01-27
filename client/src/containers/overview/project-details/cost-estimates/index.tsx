import { FC } from "react";

import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";

import CompareButton from "@/containers/overview/project-details/compare-button";
import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface CostEstimatesProps {
  items: CostItem[];
}
const CostEstimates: FC<CostEstimatesProps> = ({ items }) => {
  const { "compare-with-other-project": compareWithOtherProject } =
    FEATURE_FLAGS;
  return (
    <>
      <div className="flex items-center justify-between p-4 py-2">
        <div className="flex items-center gap-2">
          <Label
            className="text-md font-medium"
            tooltip={{
              title: "Cost estimates",
              content:
                "Refers to the summary of Capital Expenditure and Operating Expenditure",
            }}
          >
            <h3 className="text-md">Cost estimates</h3>
          </Label>
        </div>
        {compareWithOtherProject && <CompareButton />}
      </div>
      <Table className="rounded-2xl">
        <TableBody>
          {items.map(({ costName, label, value }) => (
            <TableRow
              key={costName}
              className={cn({
                "divide-background": true,
                "bg-big-stone-950 hover:bg-big-stone-950":
                  costName === "capex" ||
                  costName === "opex" ||
                  costName === "totalCost",
              })}
            >
              <TableCell className="text-muted-foreground">{label}</TableCell>
              <TableCell className="px-4">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CostEstimates;

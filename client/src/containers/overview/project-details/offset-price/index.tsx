import { FC, useEffect, useState } from "react";

import { ProjectScorecardDto } from "@shared/dtos/projects/project-scorecard.dto";
import { PROJECT_PRICE_TYPE } from "@shared/entities/projects.entity";
import { useAtomValue } from "jotai";

import { formatCurrency } from "@/lib/format";

import { projectDetailsFiltersAtom } from "@/app/(overview)/store";

import { FILTERS } from "@/constants/tooltip";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectDetailsOffsetPriceProps {
  data?: ProjectScorecardDto["projectCost"];
  creditsIssued?: number;
  priceType?: PROJECT_PRICE_TYPE;
}

const getInitialPriceType = (priceType?: PROJECT_PRICE_TYPE) =>
  priceType === PROJECT_PRICE_TYPE.TOTAL_COST_BREAKEVEN
    ? PROJECT_PRICE_TYPE.TOTAL_COST_BREAKEVEN
    : PROJECT_PRICE_TYPE.OPEX_BREAKEVEN;

const ProjectDetailsOffsetPrice: FC<ProjectDetailsOffsetPriceProps> = ({
  data,
  creditsIssued = 0,
  priceType,
}) => {
  const { costRangeSelector } = useAtomValue(projectDetailsFiltersAtom);
  const [selectedPriceType, setSelectedPriceType] = useState(
    getInitialPriceType(priceType),
  );

  useEffect(() => {
    setSelectedPriceType(getInitialPriceType(priceType));
  }, [priceType]);

  const costData = data?.[costRangeSelector];
  const selectedCost =
    selectedPriceType === PROJECT_PRICE_TYPE.TOTAL_COST_BREAKEVEN
      ? costData?.totalCost
      : costData?.opex;
  const hasCredits = Number.isFinite(creditsIssued) && creditsIssued > 0;
  const hasCost =
    typeof selectedCost === "number" && Number.isFinite(selectedCost);
  const offsetPrice =
    hasCredits && hasCost ? selectedCost / creditsIssued : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          className="text-md font-medium"
          tooltip={{
            title: "Offset price",
            content: FILTERS.BREAKEVEN_PRICE_TYPE,
          }}
        >
          <h3 className="text-md">Offset price</h3>
        </Label>
        <p className="text-sm text-muted-foreground">Cost per credit issued</p>
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-bold">
          {offsetPrice === null
            ? "Not available"
            : formatCurrency(offsetPrice, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </span>
        {offsetPrice !== null && (
          <span className="text-sm text-muted-foreground">/tCO2e</span>
        )}
        {!hasCredits && (
          <span className="text-sm text-muted-foreground">
            No credits issued
          </span>
        )}
        {hasCredits && !hasCost && (
          <span className="text-sm text-muted-foreground">
            Cost data unavailable
          </span>
        )}
      </div>

      <div className="w-full max-w-xs">
        <Label htmlFor="offset-price-type" className="mb-2 block text-sm">
          Price type
        </Label>
        <Select
          value={selectedPriceType}
          onValueChange={(value) =>
            setSelectedPriceType(value as PROJECT_PRICE_TYPE)
          }
        >
          <SelectTrigger id="offset-price-type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PROJECT_PRICE_TYPE.OPEX_BREAKEVEN}>
              OpEx breakeven
            </SelectItem>
            <SelectItem value={PROJECT_PRICE_TYPE.TOTAL_COST_BREAKEVEN}>
              Total cost breakeven
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectDetailsOffsetPrice;

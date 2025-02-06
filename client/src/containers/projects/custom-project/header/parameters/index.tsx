import { CUSTOM_PROJECT_PRICE_TYPE } from "@shared/dtos/custom-projects/custom-projects.enums";
import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { FILTER_KEYS } from "@/app/(overview)/constants";

import { INITIAL_COST_RANGE } from "@/containers/overview/filters/constants";
import {
  filtersSchema,
  useCustomProjectFilters,
} from "@/containers/projects/url-store";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const getProjectParameters = (hasOpenBreakEvenPrice: boolean) =>
  [
    {
      key: FILTER_KEYS[3],
      label: "Cost type",
      className: "w-[125px]",
      disabled: false,
      options: [
        {
          label: COST_TYPE_SELECTOR.NPV.toUpperCase(),
          value: COST_TYPE_SELECTOR.NPV,
        },
        {
          label: COST_TYPE_SELECTOR.TOTAL,
          value: COST_TYPE_SELECTOR.TOTAL,
        },
      ],
    },
    {
      key: FILTER_KEYS[2],
      label: "Carbon pricing type",
      className: "w-[240px]",
      disabled: !hasOpenBreakEvenPrice,
      options: [
        {
          label: CUSTOM_PROJECT_PRICE_TYPE.INITIAL_CARBON_PRICE_ASSUMPTION,
          value: CUSTOM_PROJECT_PRICE_TYPE.INITIAL_CARBON_PRICE_ASSUMPTION,
        },
        {
          label: CUSTOM_PROJECT_PRICE_TYPE.BREAKEVEN_PRICE,
          value: CUSTOM_PROJECT_PRICE_TYPE.BREAKEVEN_PRICE,
        },
      ],
    },
  ] as const;

interface CustomProjectParametersProps {
  hasOpenBreakEvenPrice: boolean;
  className?: HTMLDivElement["className"];
}
export default function CustomProjectParameters({
  hasOpenBreakEvenPrice,
  className,
}: CustomProjectParametersProps) {
  const [filters, setFilters] = useCustomProjectFilters();

  const handleParameters = async (
    v: string,
    parameter: keyof Omit<z.infer<typeof filtersSchema>, "keyword">,
  ) => {
    await setFilters((prev) => ({
      ...prev,
      [parameter]: v,
      ...(parameter === "costRangeSelector" && {
        costRange: INITIAL_COST_RANGE[v as COST_TYPE_SELECTOR],
      }),
    }));
  };

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {getProjectParameters(hasOpenBreakEvenPrice).map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            defaultValue={filters[parameter.key]}
            onValueChange={(v) => {
              handleParameters(v, parameter.key);
            }}
            disabled={parameter.disabled}
          >
            <SelectTrigger className={parameter.className}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parameter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

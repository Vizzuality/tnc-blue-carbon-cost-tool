import {
  PROJECT_SIZE_FILTER,
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";

import { FILTER_KEYS } from "@/app/(overview)/constants";
import {
  Parameter,
  useProjectOverviewFilters,
} from "@/app/(overview)/url-store";

import { FILTERS } from "@/constants/tooltip";

import { INITIAL_COST_RANGE } from "@/containers/overview/filters/constants";

import InfoButton from "@/components/ui/info-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PROJECT_PARAMETERS: Parameter[] = [
  {
    key: FILTER_KEYS[1],
    label: "Project size",
    className: "w-[125px]",
    tooltipContent: FILTERS.PROJECT_SIZE,
    options: [
      {
        label: PROJECT_SIZE_FILTER.SMALL,
        value: PROJECT_SIZE_FILTER.SMALL,
      },
      {
        label: PROJECT_SIZE_FILTER.MEDIUM,
        value: PROJECT_SIZE_FILTER.MEDIUM,
      },
      {
        label: PROJECT_SIZE_FILTER.LARGE,
        value: PROJECT_SIZE_FILTER.LARGE,
      },
    ],
  },
  {
    key: FILTER_KEYS[2],
    label: "Carbon pricing type",
    className: "w-[195px]",
    tooltipContent: FILTERS.CARBON_PRICING_TYPE,
    options: [
      {
        label: PROJECT_PRICE_TYPE.MARKET_PRICE,
        value: PROJECT_PRICE_TYPE.MARKET_PRICE,
      },
      {
        label: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
        value: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
        disabled: true,
      },
    ],
  },
  {
    key: FILTER_KEYS[3],
    label: "Cost",
    className: "w-[85px]",
    tooltipContent: FILTERS.COST_TYPE,
    options: [
      {
        label: COST_TYPE_SELECTOR.TOTAL,
        value: COST_TYPE_SELECTOR.TOTAL,
      },
      {
        label: COST_TYPE_SELECTOR.NPV,
        value: COST_TYPE_SELECTOR.NPV,
      },
    ],
  },
] as const;

export default function ParametersProjects() {
  const [filters, setFilters] = useProjectOverviewFilters();

  const handleParameters = async (
    v: string,
    parameter: keyof typeof filters,
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
    <div className="flex items-center space-x-4">
      {PROJECT_PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <InfoButton title={parameter.label}>
            {parameter.tooltipContent}
          </InfoButton>
          <Select
            name={parameter.label}
            defaultValue={String(
              filters[parameter.key as keyof typeof filters],
            )}
            onValueChange={(v) => {
              handleParameters(v, parameter.key);
            }}
          >
            <SelectTrigger className={parameter.className}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {parameter.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option?.disabled}
                >
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

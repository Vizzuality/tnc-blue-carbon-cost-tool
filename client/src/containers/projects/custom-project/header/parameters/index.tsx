import {
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";
import { z } from "zod";

import { FILTER_KEYS } from "@/app/(overview)/constants";
import { filtersSchema } from "@/app/(overview)/url-store";

import { INITIAL_COST_RANGE } from "@/containers/overview/filters/constants";
import { useGlobalFilters } from "@/containers/projects/url-store";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PROJECT_PARAMETERS = [
  {
    key: FILTER_KEYS[3],
    label: "Project size",
    className: "w-[125px]",
    options: [
      {
        label: COST_TYPE_SELECTOR.NPV,
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
    className: "w-[195px]",
    options: [
      {
        label: PROJECT_PRICE_TYPE.MARKET_PRICE,
        value: PROJECT_PRICE_TYPE.MARKET_PRICE,
      },
      {
        label: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
        value: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
      },
    ],
  },
] as const;

export default function CustomProjectParameters() {
  const [filters, setFilters] = useGlobalFilters();

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
    <div className="flex flex-1 items-center justify-end space-x-4">
      {PROJECT_PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            defaultValue={filters[parameter.key]}
            onValueChange={(v) => {
              handleParameters(v, parameter.key);
            }}
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

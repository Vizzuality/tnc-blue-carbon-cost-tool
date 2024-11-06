import { z } from "zod";

import {
  CARBON_PRICING_TYPE_VALUES,
  COST_VALUES,
  FILTER_KEYS,
  PROJECT_SIZE_VALUES,
} from "@/app/(projects)/constants";
import { useGlobalFilters } from "@/app/(projects)/url-store";
import { filtersSchema } from "@/app/(projects)/url-store";

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
    key: FILTER_KEYS[1],
    label: "Project size",
    className: "w-[125px]",
    options: [
      {
        label: "Small",
        value: PROJECT_SIZE_VALUES[0],
      },
      {
        label: "Medium",
        value: PROJECT_SIZE_VALUES[1],
      },
      {
        label: "Large",
        value: PROJECT_SIZE_VALUES[2],
      },
    ],
  },
  {
    key: FILTER_KEYS[2],
    label: "Carbon pricing type",
    className: "w-[195px]",
    options: [
      {
        label: "Market price",
        value: CARBON_PRICING_TYPE_VALUES[0],
      },
      {
        label: "OPEX Breakeven price",
        value: CARBON_PRICING_TYPE_VALUES[1],
      },
    ],
  },
  {
    key: FILTER_KEYS[3],
    label: "Cost",
    className: "w-[85px]",
    options: [
      {
        label: "Total",
        value: COST_VALUES[0],
      },
      {
        label: "NPV",
        value: COST_VALUES[1],
      },
    ],
  },
] as const;

export default function ParametersProjects() {
  const [filters, setFilters] = useGlobalFilters();

  const handleParameters = async (
    v: string,
    parameter: keyof Omit<z.infer<typeof filtersSchema>, "keyword">,
  ) => {
    await setFilters((prev) => ({ ...prev, [parameter]: v }));
  };

  return (
    <div className="flex items-center space-x-4">
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

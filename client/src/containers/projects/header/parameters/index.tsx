import { useAtom, ExtractAtomValue } from "jotai";

import { projectsFiltersState } from "@/app/(projects)/store";

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
    label: "Project size",
    key: "projectSize",
    defaultValue: "medium",
    options: [
      {
        label: "Small",
        value: "small",
      },
      {
        label: "Medium",
        value: "medium",
      },
      {
        label: "Large",
        value: "large",
      },
    ],
  },
  {
    label: "Carbon pricing type",
    key: "carbonPricingType",
    defaultValue: "market_price",
    options: [
      {
        label: "Market price",
        value: "market_price",
      },
      {
        label: "OPEX Breakeven price",
        value: "opex_breakeven_price",
      },
    ],
  },
  {
    label: "Cost",
    key: "cost",
    defaultValue: "npv",
    options: [
      {
        label: "Total",
        value: "total",
      },
      {
        label: "NPV",
        value: "npv",
      },
    ],
  },
] as const;

export default function ParametersProjects() {
  const [, setFilters] = useAtom(projectsFiltersState);

  const handleParameters = (
    v: string,
    parameter: keyof Omit<
      ExtractAtomValue<typeof projectsFiltersState>,
      "keyword"
    >,
  ) => {
    setFilters((prev) => ({ ...prev, [parameter]: v }));
  };

  return (
    <div className="flex items-center space-x-4">
      {PROJECT_PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            defaultValue={parameter.defaultValue}
            onValueChange={(v) => {
              handleParameters(v, parameter.key);
            }}
          >
            <SelectTrigger className="w-[165px]">
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

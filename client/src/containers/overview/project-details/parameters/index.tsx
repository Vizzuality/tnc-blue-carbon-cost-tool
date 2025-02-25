import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { useAtom } from "jotai";

import { FILTER_KEYS } from "@/app/(overview)/constants";
import { projectDetailsFiltersAtom } from "@/app/(overview)/store";
import type { ProjectDetailsFilters } from "@/app/(overview)/store";
import { Parameter } from "@/app/(overview)/url-store";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PROJECT_PARAMETERS: Parameter<keyof ProjectDetailsFilters>[] = [
  {
    key: FILTER_KEYS[3],
    label: "Cost type",
    className: "w-[85px] [&>span]:first-letter:capitalize",
    options: [
      {
        label: COST_TYPE_SELECTOR.TOTAL,
        value: COST_TYPE_SELECTOR.TOTAL,
      },
      {
        label: COST_TYPE_SELECTOR.NPV.toUpperCase(),
        value: COST_TYPE_SELECTOR.NPV,
      },
    ],
  },
] as const;

export default function ParametersProjects() {
  const [filters, setFilters] = useAtom(projectDetailsFiltersAtom);

  const handleParameters = (
    v: string,
    parameter: keyof ProjectDetailsFilters,
  ) => {
    setFilters((prev) => ({ ...prev, [parameter]: v as COST_TYPE_SELECTOR }));
  };

  return (
    <div className="flex items-center space-x-4">
      {PROJECT_PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            defaultValue={String(filters[parameter.key])}
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
                  className="[&>span]:first-letter:capitalize"
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

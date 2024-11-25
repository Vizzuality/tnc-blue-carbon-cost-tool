import { atom, useAtom } from "jotai";
import {
  PROJECT_SIZE_FILTER,
  COST_TYPE_SELECTOR,
  PROJECT_PRICE_TYPE,
} from "@shared/entities/projects.entity";
import { z } from "zod";

import {
  FILTER_KEYS,
  INITIAL_ABATEMENT_POTENTIAL_RANGE,
  INITIAL_COST_RANGE,
} from "@/app/(overview)/constants";
import { filtersSchema } from "@/app/(overview)/url-store";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_FILTERS_STATE: Partial<z.infer<typeof filtersSchema>> = {
  projectSizeFilter: PROJECT_SIZE_FILTER.MEDIUM,
  priceType: PROJECT_PRICE_TYPE.OPEN_BREAK_EVEN_PRICE,
  costRange: INITIAL_COST_RANGE,
};

const filtersAtom = atom(INITIAL_FILTERS_STATE);

export const PROJECT_PARAMETERS = [
  {
    key: FILTER_KEYS[1],
    label: "Project size",
    className: "w-[125px]",
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
  {
    key: FILTER_KEYS[3],
    label: "Cost",
    className: "w-[85px]",
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

function useFilters() {
  return useAtom(filtersAtom);
}

export default function ParametersProjects() {
  const [filters, setFilters] = useFilters();

  const handleParameters = (
    v: string,
    parameter: keyof Omit<z.infer<typeof filtersSchema>, "keyword">,
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

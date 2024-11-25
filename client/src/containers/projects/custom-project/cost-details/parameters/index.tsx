import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";

import { FILTER_KEYS } from "@/app/(overview)/constants";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PARAMETERS = [
  {
    key: FILTER_KEYS[3],
    label: "Cost type",
    className: "w-full",
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
  {
    key: "carbon-price-type",
    label: "Carbon pricing type",
    className: "w-full",
    options: [
      {
        label: "Initial carbon price assumption",
        value: "mock",
      },
    ],
  },
] as const;

export default function CostDetailsParameters() {
  // const handleParameters = async (
  //   v: string,
  //   // parameter: keyof Omit<z.infer<typeof filtersSchema>, "keyword">,
  // ) => {
  //   // TODO
  // };

  return (
    <div className="flex items-center space-x-4">
      {PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center space-x-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            // defaultValue={filters[parameter.key]}
            // onValueChange={(v) => {
            // handleParameters(v, parameter.key);
            // }}
          >
            <SelectTrigger className={parameter.className}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
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

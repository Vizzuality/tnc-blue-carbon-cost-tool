import { COST_TYPE_SELECTOR } from "@shared/entities/projects.entity";
import { useAtom } from "jotai";

import { FILTER_KEYS } from "@/app/(overview)/constants";
import { costDetailsFilterAtom } from "@/app/projects/[id]/store";

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
    className: "",
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

export default function CostDetailsParameters() {
  const [filter, setFilter] = useAtom(costDetailsFilterAtom);

  return (
    <div className="flex items-center space-x-4">
      {PARAMETERS.map((parameter) => (
        <div key={parameter.label} className="flex items-center gap-2">
          <Label htmlFor={parameter.label}>{parameter.label}</Label>
          <Select
            name={parameter.label}
            value={filter}
            onValueChange={(v) => setFilter(v as COST_TYPE_SELECTOR)}
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

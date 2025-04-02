import { ComponentProps } from "react";

import { useFormContext } from "react-hook-form";

import { CustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { toDecimalPercentageValue, toPercentageValue } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CellValue({
  name,
  className,
  hasUnit = false,
  isPercentage = false,
}: {
  name: keyof CustomProjectForm;
  className?: ComponentProps<typeof FormControl>["className"];
  hasUnit?: boolean;
  isPercentage?: boolean;
}) {
  const form = useFormContext<CustomProjectForm>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const { value, onChange, ...restField } = field;

        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                {...restField}
                type="number"
                placeholder="Insert value"
                min={0}
                defaultValue={
                  isPercentage
                    ? toPercentageValue(value as number)
                    : (value as number)
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (isPercentage && value) {
                    onChange(toDecimalPercentageValue(value));
                  } else {
                    onChange(value);
                  }
                }}
                className={cn({
                  "pr-12": hasUnit,
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

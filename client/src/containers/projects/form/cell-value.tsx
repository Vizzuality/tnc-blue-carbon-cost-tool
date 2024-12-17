import { ComponentProps } from "react";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { CreateCustomProjectForm } from "@/containers/projects/form/setup";

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
}: {
  name: keyof CreateCustomProjectForm;
  className?: ComponentProps<typeof FormControl>["className"];
  hasUnit?: boolean;
}) {
  const form = useFormContext<CreateCustomProjectForm>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { value, ...restField } = field;

        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                {...restField}
                type="number"
                placeholder="Insert value"
                min={0}
                defaultValue={field.value as number}
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

import { useState, ChangeEvent } from "react";

import { toDecimalPercentageValue, toPercentageValue } from "@/lib/format";
import { cn } from "@/lib/utils";

import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

export interface NumberInputProps extends InputProps {
  name: string;
  label: string;
  tooltip: {
    title: string;
    content: string;
  };
  initialValue?: string | number;
  isPercentage?: boolean;
  formItemClassName?: string;
  formControlClassName?: string;
  onValueChange?: (value: number | null) => void;
}

export default function NumberInput({
  name,
  label,
  tooltip,
  initialValue,
  isPercentage,
  formItemClassName,
  formControlClassName,
  onValueChange,
  ...props
}: NumberInputProps) {
  const [value, setValue] = useState<string>(
    isPercentage && typeof initialValue === "number"
      ? toPercentageValue(initialValue)
      : (initialValue?.toString() ?? ""),
  );
  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (onValueChange) {
      if (newValue === "") {
        onValueChange(null);
      } else {
        const parsedValue = isPercentage
          ? toDecimalPercentageValue(newValue)
          : Number(newValue);
        onValueChange(parsedValue);
      }
    }
  };

  return (
    <FormField
      name={name}
      render={() => (
        <>
          <FormItem className={formItemClassName}>
            <div className="flex-1">
              <FormLabel
                tooltip={{
                  title: tooltip.title,
                  content: tooltip.content,
                }}
              >
                {label}
              </FormLabel>
            </div>
            <FormControl
              className={cn(
                "relative after:absolute after:right-9 after:inline-block after:text-sm after:text-muted-foreground",
                formControlClassName,
              )}
            >
              <div className="relative flex flex-1 items-center">
                <Input
                  type="number"
                  className="w-full"
                  min={0}
                  value={value}
                  onChange={handleOnChange}
                  {...props}
                />
              </div>
            </FormControl>
          </FormItem>
          <FormMessage className="text-right" />
        </>
      )}
    />
  );
}

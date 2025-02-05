import { useState, ChangeEvent } from "react";

import { toPercentageValue, toDecimalPercentageValue } from "@/lib/format";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

export interface NumberFormItemProps extends InputProps {
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

export default function NumberFormItem({
  label,
  tooltip,
  initialValue,
  isPercentage,
  formItemClassName,
  formControlClassName,
  onValueChange,
  placeholder,
  ...props
}: NumberFormItemProps) {
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
      <div className="flex-1 space-y-2">
        <FormControl
          className={cn(
            "relative after:absolute after:right-6 after:inline-block after:text-sm after:text-muted-foreground",
            formControlClassName,
          )}
        >
          <div className="relative flex flex-1 items-center">
            <Input
              type="number"
              className="w-full pr-12"
              min={0}
              value={value}
              onChange={handleOnChange}
              placeholder={placeholder || "Insert value"}
              {...props}
            />
          </div>
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
}

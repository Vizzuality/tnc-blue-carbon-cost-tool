import { useState, ChangeEvent, useEffect } from "react";

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
    content: string | React.ReactNode;
  };
  initialValue?: string | number;
  isPercentage?: boolean;
  formItemClassName?: string;
  formControlClassName?: string;
  "data-testid"?: string;
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
  value,
  "data-testid": dataTestId,
  ...props
}: NumberFormItemProps) {
  const [state, setState] = useState<string>(
    isPercentage && typeof initialValue === "number"
      ? toPercentageValue(initialValue)
      : (initialValue?.toString() ?? ""),
  );
  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setState(newValue);

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

  useEffect(() => {
    if (value) {
      setState(value.toString());
    }
  }, [value]);

  return (
    <FormItem className={formItemClassName} data-testid={dataTestId}>
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
              value={state}
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

"use client";

import * as React from "react";
import { ComponentProps } from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow transition-colors hover:border-sky-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <CheckIcon className="h-4 w-4 text-secondary-foreground" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWrapper = function ({
  label,
  ...checkboxProps
}: ComponentProps<typeof Checkbox> & { label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...checkboxProps} />
      <Label htmlFor={checkboxProps.id} className="text-foreground">
        {label}
      </Label>
    </div>
  );
};

export { Checkbox, CheckboxWrapper };

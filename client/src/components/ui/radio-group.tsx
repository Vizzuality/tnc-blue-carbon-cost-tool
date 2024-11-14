"use client";

import * as React from "react";

import { DotFilledIcon } from "@radix-ui/react-icons";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <DotFilledIcon className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioGroupItemBoxProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: string;
}

const RadioGroupItemBox = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemBoxProps
>(({ className, checked, label, value, ...radioProps }, ref) => {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-xl border border-border p-4",
        className,
        {
          "border-primary": checked,
        },
      )}
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem ref={ref} value={value} id={value} {...radioProps} />
        <Label htmlFor={value}>{label}</Label>
      </div>
    </div>
  );
});

RadioGroupItemBox.displayName = "RadioGroupItemBox";

export { RadioGroup, RadioGroupItem, RadioGroupItemBox };

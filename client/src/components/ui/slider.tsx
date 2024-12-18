"use client";

import * as React from "react";
import { useState } from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Thumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      "block h-4 w-4 rounded-full border-2 border-accent bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));

Thumb.displayName = SliderPrimitive.Thumb.displayName;

const SLIDER_TRACK_STYLES =
  "relative h-1.5 w-full grow overflow-hidden rounded-full bg-big-stone-1000";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className={SLIDER_TRACK_STYLES}>
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <Thumb />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    format?: (v: number) => number | string;
  }
>(({ className, format = (v: number) => v, ...props }, ref) => {
  const [isDragging, setIsDragging] = useState({
    left: false,
    right: false,
  });
  const [values, setValues] = React.useState([
    props.defaultValue?.[0] || 0,
    props.defaultValue?.[1] || 0,
  ]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
      onValueChange={(newValues) => {
        setValues(newValues);
        props?.onValueChange?.(newValues);
      }}
    >
      <SliderPrimitive.Track className={SLIDER_TRACK_STYLES}>
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <Tooltip {...(isDragging["left"] && { open: true })}>
        <TooltipTrigger asChild>
          <Thumb
            onPointerDown={() => {
              setIsDragging((prevState) => ({ ...prevState, left: true }));
            }}
            onPointerUp={() => {
              setIsDragging((prevState) => ({ ...prevState, left: false }));
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {format(values[0])}
        </TooltipContent>
      </Tooltip>

      <Tooltip {...(isDragging["right"] && { open: true })}>
        <TooltipTrigger asChild>
          <Thumb
            onPointerDown={() => {
              setIsDragging((prevState) => ({ ...prevState, right: true }));
            }}
            onPointerUp={() => {
              setIsDragging((prevState) => ({ ...prevState, right: false }));
            }}
          />
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {format(values[1])}
        </TooltipContent>
      </Tooltip>
    </SliderPrimitive.Root>
  );
});

RangeSlider.displayName = SliderPrimitive.Root.displayName;

const SliderLabels = function ({
  min,
  max,
}: {
  min: React.ReactNode;
  max: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between text-foreground">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  );
};

export { Slider, RangeSlider, SliderLabels };

"use client";

import * as React from "react";

import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

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
    <Thumb />
  </SliderPrimitive.Root>
));

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

"use client";

import * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & {
      tooltip?: {
        title: string;
        content: React.ReactNode;
      };
    }
>(({ className, tooltip, ...props }, ref) => {
  if (tooltip) {
    return (
      <div className="flex items-center gap-2">
        <LabelPrimitive.Root
          ref={ref}
          className={cn(labelVariants(), className)}
          {...props}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="group h-5 w-5 p-0 hover:bg-transparent"
            >
              <InfoIcon className="h-7 w-7 text-foreground hover:text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{tooltip.title}</DialogTitle>
              <DialogDescription>{tooltip.content}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

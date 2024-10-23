import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ControlsProps = PropsWithChildren<{
  className?: HTMLDivElement["className"];
}>;

export default function Controls({ className, children }: ControlsProps) {
  return (
    <div
      className={cn(
        "absolute right-4 top-4 flex flex-col items-center justify-center space-y-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

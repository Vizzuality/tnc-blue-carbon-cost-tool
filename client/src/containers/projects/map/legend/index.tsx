import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export default function Legend({
  children,
  className,
}: PropsWithChildren<{
  className?: HTMLDivElement["className"];
}>) {
  return (
    <div
      className={cn(
        "absolute bottom-8 right-16 rounded-2xl bg-blue-950 p-2 text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}

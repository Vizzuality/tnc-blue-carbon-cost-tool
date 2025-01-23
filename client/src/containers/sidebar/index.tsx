import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface SideBarProps extends PropsWithChildren {
  className?: HTMLElement["className"];
}

export default function Sidebar({ children, className }: SideBarProps) {
  return (
    <aside
      className={cn(
        "flex h-full max-w-[320px] flex-col justify-between pb-6",
        className,
      )}
    >
      {children}
    </aside>
  );
}

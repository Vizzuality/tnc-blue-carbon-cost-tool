import { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import { SidebarTrigger } from "@/components/ui/sidebar";

interface TopbarProps extends PropsWithChildren {
  title: string;
  className?: HTMLDivElement["className"];
}

const Topbar: FC<TopbarProps> = ({ title, className, children }) => {
  return (
    <header
      className={cn("flex w-full items-center justify-between py-3", className)}
    >
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">{title}</h2>
      </div>
      {children}
    </header>
  );
};

export default Topbar;

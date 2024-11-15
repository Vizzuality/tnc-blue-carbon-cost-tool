import { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import { SidebarTrigger } from "@/components/ui/sidebar";

type AuthLayout = PropsWithChildren<{
  className?: HTMLDivElement["className"];
}>;

const AuthLayout: FC<AuthLayout> = ({ className, children }) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center space-x-2 p-4">
        <SidebarTrigger />
        <h2 className="text-2xl font-medium">User area</h2>
      </div>
      <div className="container px-4">
        <div className="flex w-full justify-center">
          <div
            className={cn("w-full max-w-screen-sm space-y-2 pt-20", className)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

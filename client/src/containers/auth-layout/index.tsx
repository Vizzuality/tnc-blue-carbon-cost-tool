import { FC, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type AuthLayout = PropsWithChildren<{
  className?: HTMLDivElement["className"];
}>;

const AuthLayout: FC<AuthLayout> = ({ className, children }) => {
  return (
    <div className="container px-10">
      <div className="p-4">
        <h2 className="text-2xl font-medium">User area</h2>
      </div>
      <div className="flex w-full justify-center">
        <div className={cn("w-full max-w-screen-sm", className)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

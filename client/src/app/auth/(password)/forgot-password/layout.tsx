import { PropsWithChildren } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Forgot password | Blue Carbon Cost Tool",
};

export default function ForgotPasswordLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
}

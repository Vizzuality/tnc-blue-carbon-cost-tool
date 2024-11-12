import { PropsWithChildren } from "react";

import type { Metadata } from "next";

import AuthLayout from "@/containers/auth-layout";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Forgot password | Blue Carbon Cost Tool",
};

export default function ForgotPasswordLayout({ children }: PropsWithChildren) {
  return <AuthLayout className="pt-20">{children}</AuthLayout>;
}

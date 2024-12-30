import { redirect } from "next/navigation";

import { Metadata } from "next";

import { getServerSession } from "@/lib/auth/server";

import SignIn from "@/containers/auth/signin";
import AuthLayout from "@/containers/auth-layout";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in | Blue Carbon Cost Tool",
};

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}

import { redirect } from "next/navigation";

import { Metadata } from "next";

import { getServerSession } from "@/lib/auth/server";

import SignUp from "@/containers/auth/signup";
import AuthLayout from "@/containers/auth-layout";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account | Blue Carbon Cost Tool",
};

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/profile");
  }

  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

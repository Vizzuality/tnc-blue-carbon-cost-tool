import { redirect } from "next/navigation";

import { Metadata } from "next";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import SignUp from "@/containers/auth/signup";
import AuthLayout from "@/containers/auth-layout";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account | Blue Carbon Cost Tool",
};

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/profile");
  }

  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

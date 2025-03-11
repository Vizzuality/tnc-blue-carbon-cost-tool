import { redirect } from "next/navigation";

import { Metadata } from "next";

import { REDIRECT_SIGNIN_PATH } from "@/lib/constants";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import SignIn from "@/containers/auth/signin";
import AuthLayout from "@/containers/auth-layout";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in | Blue Carbon Cost Tool",
};

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect(REDIRECT_SIGNIN_PATH);
  }

  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}

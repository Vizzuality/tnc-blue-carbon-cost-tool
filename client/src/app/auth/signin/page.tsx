import { redirect } from "next/navigation";

import { auth } from "@/app/auth/api/[...nextauth]/config";

import SignIn from "@/containers/auth/signin";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/profile");
  }

  return <SignIn />;
}

import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import SignInForm from "./form";

const SignIn: FC = () => {
  return (
    <div className="container my-10">
      <div className="grid grid-cols-12 justify-center">
        <div className="col-span-6 col-start-4">
          <h2 className="mb-4 px-8 text-center text-4xl font-semibold">
            Welcome to Blue Carbon Cost
          </h2>
          <SignInForm />
          <Button variant="link" className="mt-6 flex" asChild>
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SignInForm from "./form";

const SignIn: FC = () => {
  return (
    <>
      <Card variant="secondary" className="p-6">
        <CardHeader className="space-y-4">
          <CardTitle className="text-xl font-semibold">
            Welcome to Blue Carbon Cost
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            To sign in please enter your email and password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
      <Card variant="secondary" className="p-6">
        <p className="text-sm">
          <span className="pr-2 text-muted-foreground">
            Don&apos;t have an account?
          </span>
          <Button variant="link" className="p-0 text-primary" asChild>
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </p>
      </Card>
    </>
  );
};

export default SignIn;

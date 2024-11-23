import { FC } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import SignUpForm from "./form";

const SignUp: FC = () => {
  return (
    <>
      <Card variant="secondary" className="p-6">
        <CardHeader className="space-y-4">
          <CardTitle className="text-xl font-semibold">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            To create your account please fill in the details bellow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
      <Card variant="secondary" className="p-6">
        <p className="text-sm">
          <span className="pr-2 text-muted-foreground">
            Already have an account?
          </span>
          <Button variant="link" className="p-0 text-primary" asChild>
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </p>
      </Card>
    </>
  );
};

export default SignUp;

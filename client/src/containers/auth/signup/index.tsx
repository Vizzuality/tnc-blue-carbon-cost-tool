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
    <div className="container my-10 pt-20">
      <div className="grid grid-cols-12 justify-center">
        <div className="col-span-6 col-start-4 space-y-2">
          <Card variant="secondary">
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
        </div>
      </div>
    </div>
  );
};

export default SignUp;

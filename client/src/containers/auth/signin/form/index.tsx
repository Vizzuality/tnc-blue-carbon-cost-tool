"use client";

import { FC, FormEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { z } from "zod";

import { useAuth } from "@/lib/auth/context";

import EmailInput from "@/containers/auth/email-input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SignInFormProps {
  onSignIn?: () => void;
}
const SignInForm: FC<SignInFormProps> = ({ onSignIn }) => {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "adam.trincas@vizzuality.com",
      password: "12345678",
    },
  });

  const handleSignIn = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      setErrorMessage(undefined);

      form.handleSubmit(async (formValues) => {
        try {
          await login(formValues.email, formValues.password);
          if (onSignIn) {
            onSignIn();
          } else {
            router.push(searchParams.get("callbackUrl") ?? "/profile");
          }
        } catch (error) {
          if (error instanceof Error) {
            setErrorMessage(error.message ?? "unknown error");
          }
        }
      })(evt);
    },
    [form, router, searchParams, login, onSignIn],
  );

  return (
    <Form {...form}>
      <form ref={formRef} className="w-full space-y-6" onSubmit={handleSignIn}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => <EmailInput {...field} />}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Button
                  variant="link"
                  className="p-0 font-normal text-muted-foreground"
                  asChild
                >
                  <Link href="/auth/forgot-password">Forgot password?</Link>
                </Button>
              </div>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="*******"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <div className="text-center text-destructive">{errorMessage}</div>
        )}
        <div className="flex justify-end">
          <Button variant="default" type="submit">
            Log in
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;

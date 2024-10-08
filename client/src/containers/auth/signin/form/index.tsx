"use client";

import { FC, FormEvent, useCallback, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { useSearchParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { signIn } from "next-auth/react";
import { z } from "zod";

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

const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      setErrorMessage(undefined);

      form.handleSubmit(async (formValues) => {
        try {
          const response = await signIn("credentials", {
            ...formValues,
            redirect: false,
          });

          if (response?.ok) {
            router.push(searchParams.get("callbackUrl") ?? "/profile");
          }

          if (!response?.ok) {
            setErrorMessage(response?.error ?? "unknown error");
          }
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message ?? "unknown error");
          }
        }
      })(evt);
    },
    [form, router, searchParams],
  );

  return (
    <Form {...form}>
      <form ref={formRef} className="w-full space-y-8" onSubmit={handleSignIn}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
        <div className="space-y-2 px-8">
          <Button variant="secondary" type="submit" className="w-full">
            Log in
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;

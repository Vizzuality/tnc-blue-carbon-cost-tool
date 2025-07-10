"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { REDIRECT_SIGNIN_PATH } from "@/lib/constants";

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
import { toast } from "@/components/ui/toast/use-toast";

interface SignInFormProps {
  onSignIn?: () => void;
}
const SignInForm: FC<SignInFormProps> = ({ onSignIn }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

      form.handleSubmit(async (formValues) => {
        try {
          const response = await signIn("credentials", {
            ...formValues,
            redirect: false,
          });

          if (response?.ok) {
            if (onSignIn) {
              onSignIn();
            } else {
              router.push(
                searchParams.get("callbackUrl") ?? REDIRECT_SIGNIN_PATH,
              );
            }
          }

          if (!response?.ok) {
            toast({
              description: response?.error ?? "unknown error",
              variant: "destructive",
            });
          }
        } catch (err) {
          if (err instanceof Error) {
            toast({
              description: err.message ?? "unknown error",
              variant: "destructive",
            });
          }
        }
      })(evt);
    },
    [form, router, searchParams, onSignIn],
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

"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "@shared/schemas/auth/login.schema";
import { z } from "zod";

import { client } from "@/lib/query-client";

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
import { useApiResponseToast } from "@/components/ui/toast/use-api-response-toast";

const ForgotPasswordEmailForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { apiResponseToast, toast } = useApiResponseToast();

  const handleForgotPassword = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          const { status, body } =
            await client.auth.requestPasswordRecovery.mutation({
              body: formValues,
            });
          apiResponseToast(
            { status, body },
            {
              successMessage: "Check your inbox for a password reset link.",
            },
          );
        } catch (err) {
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        } finally {
          form.reset();
        }
      })(evt);
    },
    [form, apiResponseToast, toast],
  );

  return (
    <div className="space-y-8 rounded-2xl py-6">
      <div className="space-y-4 px-6">
        <h2 className="text-xl font-semibold">Reset your password</h2>
        <p className="text-xs text-muted-foreground">
          Enter your email address, and we&apos;ll send you a link to get back
          into your account.
        </p>
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          className="w-full space-y-8"
          onSubmit={handleForgotPassword}
        >
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
          <div className="space-y-2 px-6">
            <Button variant="secondary" type="submit" className="w-full">
              Send link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordEmailForm;

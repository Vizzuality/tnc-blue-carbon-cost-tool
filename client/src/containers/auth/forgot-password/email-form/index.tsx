"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "@shared/schemas/auth/login.schema";
import { z } from "zod";

import { client } from "@/lib/query-client";

import EmailInput from "@/containers/auth/email-input";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { useApiResponseToast } from "@/components/ui/toast/use-api-response-toast";

const ForgotPasswordEmailForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useApiResponseToast();

  const handleForgotPassword = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          await client.auth.requestPasswordRecovery.mutation({
            body: formValues,
          });
          toast({
            description:
              "An email has been sent to your inbox with a link to reset your password.",
          });
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
    [form, toast],
  );

  return (
    <Card variant="secondary" className="p-6">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-semibold">Reset password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address, and we&apos;ll send you a link to get back
          into your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            className="w-full space-y-8"
            onSubmit={handleForgotPassword}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => <EmailInput {...field} />}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Cancel</Link>
              </Button>
              <Button type="submit">Send link</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordEmailForm;

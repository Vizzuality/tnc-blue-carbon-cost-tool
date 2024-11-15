"use client";

import { FC, useEffect, useRef } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpAction } from "./action";
import { signUpSchemaForm } from "./schema";

const TokenSignUpForm: FC = () => {
  const { push } = useRouter();
  const [status, formAction] = useFormState(signUpAction, {
    ok: undefined,
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof signUpSchemaForm>>({
    resolver: zodResolver(signUpSchemaForm),
    defaultValues: {
      name: "",
      partnerName: "",
      email: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (status.ok) {
      push("/auth/signin");
    }
  }, [status, push]);

  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          action={formAction}
          className="w-full space-y-6"
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit(() => {
              formAction(new FormData(formRef.current!));
            })(evt);
          }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partnerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Enter partner name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter you email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      {...field}
                      id={field.name}
                      value="privacyPolicy"
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      htmlFor={field.name}
                      className="text-xs text-muted-foreground"
                    >
                      I agree with the terms and conditions and privacy policy
                      of the Blue Carbon Cost Tool platform.
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Cancel</Link>
            </Button>
            <Button
              variant="secondary"
              type="submit"
              disabled={!form.formState.isValid}
            >
              Create account
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TokenSignUpForm;

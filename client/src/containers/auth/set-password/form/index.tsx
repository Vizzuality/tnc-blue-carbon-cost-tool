"use client";

import { FC, useEffect, useRef } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";

import { signUpAction } from "./action";
import { signUpSchemaForm } from "./schema";

const SignUpForm: FC = () => {
  const { push } = useRouter();
  const [status, formAction] = useFormState(signUpAction, {
    ok: undefined,
    message: "",
  });
  const params = useParams<{ token: string }>();

  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof signUpSchemaForm>>({
    resolver: zodResolver(signUpSchemaForm),
    defaultValues: {
      oneTimePassword: "",
      newPassword: "",
      repeatPassword: "",
      token: params.token,
    },
    mode: "onSubmit",
  });

  const {
    data: isValidToken,
    isFetching,
    isError,
  } = useSuspenseQuery({
    queryKey: queryKeys.auth.resetPasswordToken(params.token).queryKey,
    queryFn: () => {
      return client.auth.validateToken.query({
        headers: {
          authorization: `Bearer ${params.token}`,
        },
        query: {
          tokenType: TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION,
        },
      });
    },
    select: (data) => data.status === 200,
  });

  useEffect(() => {
    if (status.ok) {
      push("/auth/signin");
    }
  }, [status, push]);

  const isDisabledByTokenValidation = !isValidToken || isFetching || isError;

  useEffect(() => {
    if (!isValidToken && !isFetching) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          description: "The token is invalid or has expired.",
        });
      }, 0);
    }
  }, [isValidToken, isFetching, toast]);

  useEffect(() => {
    if (!status.ok) {
      toast({
        variant: "destructive",
        description: status.message,
      });
    }
  }, [status, toast]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="oneTimePassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the One-Time Password received in your mail"
                  required
                  disabled={isDisabledByTokenValidation}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Create a password"
                    type="password"
                    autoComplete="new-password"
                    disabled={isDisabledByTokenValidation}
                    {...field}
                  />
                </div>
              </FormControl>
              {!fieldState.invalid && (
                <FormDescription>
                  Password must contain at least 8 characters.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Repeat password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Repeat the password"
                    type="password"
                    autoComplete="new-password"
                    disabled={isDisabledByTokenValidation}
                    {...field}
                  />
                </div>
              </FormControl>
              {!fieldState.invalid && (
                <FormDescription>
                  Password must contain at least 8 characters.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
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
            disabled={!form.formState.isValid || isDisabledByTokenValidation}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;

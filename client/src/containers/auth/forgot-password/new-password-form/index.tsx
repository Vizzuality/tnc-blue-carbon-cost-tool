"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@shared/schemas/auth/login.schema";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiResponseToast } from "@/components/ui/toast/use-api-response-toast";

const NewPasswordSchema = z
  .object({
    password: PasswordSchema.shape.password,
    repeatPassword: PasswordSchema.shape.password,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });

const NewPasswordForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });
  const { apiResponseToast, toast } = useApiResponseToast();
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const {
    data: isValidToken,
    isFetching,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.resetPasswordToken(params.token).queryKey,
    queryFn: () => {
      return client.auth.validateToken.query({
        headers: {
          authorization: `Bearer ${params.token}`,
        },
        query: {
          tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD,
        },
      });
    },
    select: (data) => data.status === 200,
  });

  const handleForgotPassword = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          const { status, body } = await client.auth.resetPassword.mutation({
            body: formValues,
            extraHeaders: {
              authorization: `Bearer ${params.token}`,
            },
          });
          apiResponseToast(
            { status, body },
            {
              successMessage: "Password changed successfully.",
            },
          );
          router.push("/auth/signin");
        } catch (err) {
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        }
      })(evt);
    },
    [form, apiResponseToast, toast, params.token, router],
  );

  const isDisabled = isFetching || isError || !isValidToken;

  return (
    <div className="space-y-8 rounded-2xl py-6">
      <div className="space-y-4 px-6">
        <h2 className="text-xl font-semibold">Create new password</h2>
        {!isValidToken && (
          <p className="text-sm text-destructive">
            The token is invalid or has expired.
          </p>
        )}
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          className="w-full space-y-8"
          onSubmit={handleForgotPassword}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      placeholder="*******"
                      type="password"
                      autoComplete="new-password"
                      disabled={isDisabled}
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
                      placeholder="*******"
                      type="password"
                      autoComplete="new-password"
                      disabled={isDisabled}
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
          <div className="space-y-2 px-6">
            <Button
              variant="secondary"
              type="submit"
              className="w-full"
              disabled={isDisabled}
            >
              Change password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;

"use client";

import { FC, FormEvent, Suspense, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@shared/schemas/auth/login.schema";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  } = useSuspenseQuery({
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
    <Card variant="secondary" className="p-6">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-semibold">
          Change your password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          <Suspense fallback={<Skeleton className="h-4 rounded-md" />}>
            {/* {!isValidToken ? (
              <p className="text-sm text-destructive">
                The token is invalid or has expired.
              </p>
            ) : (
              <p>Please set a new password to secure your account.</p>
            )} */}
            <Skeleton className="h-4 rounded-md" />
          </Suspense>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isDisabled}>
                Change password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewPasswordForm;

"use client";

import { FC, FormEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";
import { RequestEmailUpdateSchema } from "@shared/schemas/users/request-email-update.schema";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useApiResponseToast } from "@/components/ui/toast/use-api-response-toast";

const NewPasswordForm: FC = () => {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const newEmail = searchParams.get("newEmail");

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof RequestEmailUpdateSchema>>({
    resolver: zodResolver(RequestEmailUpdateSchema),
    defaultValues: {
      newEmail: newEmail as NonNullable<typeof newEmail>,
    },
  });
  const { apiResponseToast, toast } = useApiResponseToast();

  const {
    data: isValidToken,
    isFetching,
    isError,
  } = useQuery({
    queryKey: queryKeys.auth.confirmEmailToken(params.token).queryKey,
    queryFn: () => {
      return client.auth.validateToken.query({
        headers: {
          authorization: `Bearer ${params.token}`,
        },
        query: {
          tokenType: TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
        },
      });
    },
    select: (data) => data.status === 200,
  });

  const handleEmailConfirmation = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      form.handleSubmit(async (formValues) => {
        try {
          const { status, body } = await client.auth.confirmEmail.mutation({
            body: formValues,
            extraHeaders: {
              authorization: `Bearer ${params.token}`,
            },
          });
          apiResponseToast(
            { status, body },
            {
              successMessage: "Email updated successfully.",
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
        <h2 className="text-xl font-semibold">Confirm email</h2>
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
          onSubmit={handleEmailConfirmation}
        >
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
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
              Confirm email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;

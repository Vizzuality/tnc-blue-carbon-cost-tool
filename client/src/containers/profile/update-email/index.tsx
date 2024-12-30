"use client";

import { FC, KeyboardEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { useAuth } from "@/lib/auth/context";
import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

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
import { useToast } from "@/components/ui/toast/use-toast";

import { accountDetailsSchema } from "./schema";

const UpdateEmailForm: FC = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const { data: user } = client.user.findMe.useQuery(
    queryKeys.user.me(session?.user?.id as string).queryKey,
    {
      extraHeaders: {
        authorization: `Bearer ${session?.accessToken as string}`,
      },
    },
    {
      select: (data) => data.body.data,
      queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
    },
  );

  const form = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      email: user?.email,
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = accountDetailsSchema.safeParse(formData);

      if (parsed.success) {
        try {
          const response = await client.user.requestEmailUpdate.mutation({
            body: {
              newEmail: parsed.data.email,
            },
            extraHeaders: {
              authorization: `Bearer ${session?.accessToken as string}`,
            },
          });

          if (response.status === 200) {
            // updateSession(response.body);

            queryClient.invalidateQueries({
              queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
            });

            toast({
              description: "You will receive an email in your inbox.",
            });
          } else {
            toast({
              variant: "destructive",
              description: "Something went wrong updating the email",
            });
          }
        } catch (e) {
          toast({
            variant: "destructive",
            description: "Something went wrong updating the email",
          });
        }
      }
    },
    [queryClient, session, toast],
  );

  const handleEnterKey = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.code === "Enter" && form.formState.isValid) {
        form.handleSubmit(() => {
          onSubmit(new FormData(formRef.current!));
        })();
      }
    },
    [form, onSubmit],
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          form.handleSubmit(() => {
            onSubmit(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your email</FormLabel>
              <FormControl>
                <div className="relative flex w-full items-center">
                  <Input
                    type="email"
                    autoComplete={field.name}
                    onKeyDown={handleEnterKey}
                    placeholder={user?.email}
                    className="w-full"
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={!form.formState.isValid}>
            Update email
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateEmailForm;

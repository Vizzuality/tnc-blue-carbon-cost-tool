"use client";

import { FC, KeyboardEvent, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";

import { accountDetailsSchema } from "./schema";

const UpdateEmailForm: FC = () => {
  const queryClient = useQueryClient();
  const { data: session, update: updateSession } = useSession();
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
        // todo: update method
        const response = await client.user.updateUser.mutation({
          params: {
            id: session?.user?.id as string,
          },
          body: {
            email: parsed.data.email,
          },
          extraHeaders: {
            authorization: `Bearer ${session?.accessToken as string}`,
          },
        });

        if (response.status === 200) {
          updateSession(response.body);

          queryClient.invalidateQueries({
            queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
          });

          toast({
            description: "Your email has been updated successfully.",
          });
        }
      }
    },
    [queryClient, session, updateSession, toast],
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
        className="flex w-full items-center justify-between space-x-4"
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
            <FormItem className="flex w-full items-center space-x-4 space-y-0">
              <FormLabel>Email</FormLabel>
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

        <Button
          variant="secondary"
          type="submit"
          disabled={!form.formState.isValid}
        >
          Update email
        </Button>
      </form>
    </Form>
  );
};

export default UpdateEmailForm;

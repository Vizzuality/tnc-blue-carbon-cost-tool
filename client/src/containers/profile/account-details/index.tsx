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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";

import { accountDetailsSchema } from "./schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UpdateEmailForm: FC<{ id: string }> = ({ id }) => {
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
      queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
    },
  );

  const form = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      confirmPassword: "",
      // role: user?.role,
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      console.log(formData);
      // const parsed = accountDetailsSchema.safeParse(formData);

      // if (parsed.success) {
      //   const response = await client.user.updateMe.mutation({
      //     params: {
      //       id: session?.user?.id as string,
      //     },
      //     body: {
      //       name: parsed.data.name,
      //     },
      //     extraHeaders: {
      //       authorization: `Bearer ${session?.accessToken as string}`,
      //     },
      //   });

      //   if (response.status === 200) {
      //     await updateSession(response.body);

      //     await queryClient.invalidateQueries({
      //       queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
      //     });

      //     toast({
      //       description: "Your account details have been updated successfully.",
      //     });
      //   }
      // }
    },
    [queryClient, session, updateSession, toast],
  );

  const handleEnterKey = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.code === "Enter" && form.formState.isValid) {
        form.handleSubmit(async () => {
          await onSubmit(new FormData(formRef.current!));
        })();
      }
    },
    [form, onSubmit],
  );

  return (
    <Card variant="secondary">
      <CardHeader className="space-y-4">
        <CardTitle id={id} className="text-xl font-semibold">
          My details
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This personal information is only visible to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            ref={formRef}
            className="w-full space-y-4"
            onSubmit={(evt) => {
              form.handleSubmit(async () => {
                await onSubmit(new FormData(formRef.current!));
              })(evt);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="text"
                        autoComplete={field.name}
                        onKeyDown={handleEnterKey}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Your password</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="Create new password"
                        type="password"
                        autoComplete="new-password"
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
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="Repeat new password"
                        type="password"
                        autoComplete="new-password"
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
            {/* <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        type="text"
                        placeholder={user?.role}
                        {...field}
                        disabled
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                // disabled={!form.formState.isValid}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateEmailForm;

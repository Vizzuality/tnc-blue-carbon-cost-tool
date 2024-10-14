"use client";

import { FC, useCallback, useRef } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";

import { changePasswordSchema } from "./schema";

const SignUpForm: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = changePasswordSchema.safeParse(formData);
      if (parsed.success) {
        try {
          const response = await client.user.updatePassword.mutation({
            body: {
              password: parsed.data.password,
              newPassword: parsed.data.newPassword,
            },
            extraHeaders: {
              authorization: `Bearer ${session?.accessToken as string}`,
            },
          });

          if (response.status === 200) {
            toast({
              description: "Your password has been updated successfully.",
            });
          }

          if (response.status === 400 || response.status === 401) {
            toast({
              variant: "destructive",
              description: response.body.errors?.[0].title,
            });
          }
        } catch (e) {
          toast({
            variant: "destructive",
            description: "Something went wrong updating the password",
          });
        }
      }
    },
    [session, toast],
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="w-full space-y-4"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            onSubmit(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    placeholder="Type your current password"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </div>
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
              <FormLabel>New password</FormLabel>
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

        <div className="!mt-10 px-8">
          <Button
            variant="secondary"
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid}
          >
            Update password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;

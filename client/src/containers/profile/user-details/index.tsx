import { FC, KeyboardEvent, useCallback, useRef } from "react";

import { useForm, UseFormReturn, FieldValues } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  // FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";

import { accountDetailsSchema } from "../account-details/schema";
import { changePasswordSchema } from "../edit-password/form/schema";
import { accountDetailsSchema as emailSchema } from "../update-email/schema";

const UserDetails: FC = () => {
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

  const accountForm = useForm<z.infer<typeof accountDetailsSchema>>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: {
      name: user?.name,
      role: user?.role,
    },
    mode: "onSubmit",
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email,
    },
    mode: "onSubmit",
  });

  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmitAccount = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = accountDetailsSchema.safeParse(formData);

      if (parsed.success) {
        const response = await client.user.updateMe.mutation({
          params: {
            id: session?.user?.id as string,
          },
          body: {
            name: parsed.data.name,
          },
          extraHeaders: {
            authorization: `Bearer ${session?.accessToken as string}`,
          },
        });

        if (response.status === 200) {
          await updateSession(response.body);
          await queryClient.invalidateQueries({
            queryKey: queryKeys.user.me(session?.user?.id as string).queryKey,
          });
          toast({
            description: "Your account details have been updated successfully.",
          });
        }
      }
    },
    [queryClient, session, updateSession, toast],
  );

  const onSubmitEmail = useCallback(
    async (data: FormData) => {
      const formData = Object.fromEntries(data);
      const parsed = emailSchema.safeParse(formData);

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
            updateSession(response.body);
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
    [queryClient, session, updateSession, toast],
  );

  const onSubmitPassword = useCallback(
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
            passwordForm.reset();
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
    [session, toast, passwordForm],
  );

  const handleEnterKey = useCallback(
    <T extends FieldValues>(
      evt: KeyboardEvent,
      form: UseFormReturn<T>,
      onSubmit: (data: FormData) => Promise<void>,
    ) => {
      if (evt.code === "Enter" && form.formState.isValid) {
        form.handleSubmit(async () => {
          await onSubmit(new FormData(formRef.current!));
        })();
      }
    },
    [],
  );

  return (
    <div className="mt-4 space-y-4">
      <Card variant="secondary" className="border-dashed p-6">
        <div className="space-y-8">
          {/* Account Details Section */}
          <Form {...accountForm}>
            <form
              ref={formRef}
              className="w-full space-y-4"
              onSubmit={(evt) => {
                evt.preventDefault();
                accountForm.handleSubmit(async () => {
                  await onSubmitAccount(new FormData(formRef.current!));
                })(evt);
              }}
            >
              <h3 className="text-lg font-medium">Account Details</h3>
              <FormField
                control={accountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type="text"
                          autoComplete={field.name}
                          onKeyDown={(e) =>
                            handleEnterKey(e, accountForm, onSubmitAccount)
                          }
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={accountForm.control}
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
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => accountForm.reset()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!accountForm.formState.isDirty}>
                  Save
                </Button>
              </div>
            </form>
          </Form>

          {/* Email Update Section */}
          <Form {...emailForm}>
            <form
              className="w-full space-y-4"
              onSubmit={(evt) => {
                evt.preventDefault();
                emailForm.handleSubmit(async () => {
                  await onSubmitEmail(new FormData(formRef.current!));
                })(evt);
              }}
            >
              <h3 className="text-lg font-medium">Email Settings</h3>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full items-center">
                        <Input
                          type="email"
                          autoComplete={field.name}
                          onKeyDown={(e) =>
                            handleEnterKey(e, emailForm, onSubmitEmail)
                          }
                          placeholder={user?.email}
                          className="w-full"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!emailForm.formState.isValid}>
                  Update email
                </Button>
              </div>
            </form>
          </Form>

          {/* Password Update Section */}
          <Form {...passwordForm}>
            <form
              className="w-full space-y-4"
              onSubmit={(evt) => {
                evt.preventDefault();
                passwordForm.handleSubmit(async () => {
                  await onSubmitPassword(new FormData(formRef.current!));
                })(evt);
              }}
            >
              <h3 className="text-lg font-medium">Password Settings</h3>
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type="password"
                          autoComplete={field.name}
                          onKeyDown={(e) =>
                            handleEnterKey(e, passwordForm, onSubmitPassword)
                          }
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type="password"
                          autoComplete={field.name}
                          onKeyDown={(e) =>
                            handleEnterKey(e, passwordForm, onSubmitPassword)
                          }
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          type="password"
                          autoComplete={field.name}
                          onKeyDown={(e) =>
                            handleEnterKey(e, passwordForm, onSubmitPassword)
                          }
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!passwordForm.formState.isValid}
                >
                  Update password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default UserDetails;

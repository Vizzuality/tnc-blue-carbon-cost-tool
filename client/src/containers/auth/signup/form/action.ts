"use server";

import { SignUpSchema } from "@shared/schemas/auth/sign-up.schema";

import { client } from "@/lib/query-client";

export type FormState = {
  ok: boolean | undefined;
  message: string | string[] | undefined;
};

export async function signUpAction(
  prevState: FormState,
  data: FormData,
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = SignUpSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid form data",
    };
  }

  try {
    const response = await client.auth.signUp.mutation({
      extraHeaders: {
        Authorization: `Bearer ${data.get("token")}`,
      },
      body: {
        oneTimePassword: parsed.data.oneTimePassword,
        newPassword: parsed.data.newPassword,
      },
    });

    if (response.status === 401) {
      return {
        ok: false,
        message:
          response.body.errors?.map(({ title }) => title) ?? "unknown error",
      };
    }
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  }

  return {
    ok: true,
    message: "account activated successfully",
  };
}

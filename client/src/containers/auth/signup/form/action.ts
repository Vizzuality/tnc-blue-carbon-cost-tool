"use server";

import { headers } from "next/headers";

import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";

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
  const parsed = CreateUserSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid update-email data",
    };
  }

  try {
    const headersList = headers();
    const response = await client.auth.register.mutation({
      extraHeaders: {
        Authorization: `Bearer ${data.get("token")}`,
        origin: headersList.get("host") || undefined,
      },
      body: {
        name: parsed.data.name,
        partnerName: parsed.data.partnerName,
        email: parsed.data.email,
      },
    });

    if (response.status !== 201) {
      return {
        ok: false,
        message:
          response.body.errors?.map(({ title }) => title).join("\n") ??
          "unknown error",
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

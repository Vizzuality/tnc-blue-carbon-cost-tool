import { SignUpSchema } from "@shared/schemas/auth/sign-up.schema";
import { z } from "zod";

export const signUpSchemaForm = SignUpSchema.and(
  z.object({
    repeatPassword: SignUpSchema.shape.newPassword,
    token: z.string().min(1),
  }),
).refine((data) => data.newPassword === data.repeatPassword, {
  message: "Passwords must match",
  path: ["repeatPassword"],
});

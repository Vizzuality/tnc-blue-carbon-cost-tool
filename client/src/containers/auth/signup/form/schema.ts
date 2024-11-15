import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";
import { z } from "zod";

export const signUpSchemaForm = CreateUserSchema.and(
  z.object({
    privacyPolicy: z.boolean().refine((value) => value === true, {
      message: "The terms and conditions and privacy policy must be accepted",
    }),
  }),
);

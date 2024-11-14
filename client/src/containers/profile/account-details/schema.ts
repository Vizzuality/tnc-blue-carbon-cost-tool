import { UpdateUserSchema } from "@shared/schemas/users/update-user.schema";
import { z } from "zod";

export const accountDetailsSchema = UpdateUserSchema.and(
  z.object({
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string({ message: "Password confirmation is required" })
      .min(1, "Password confirmation is required"),
    // role: z.enum([ROLES.ADMIN, ROLES.PARTNER]).optional(),
  }),
).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

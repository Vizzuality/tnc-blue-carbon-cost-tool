import { z } from "zod";
import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";

export const SignUpSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  newPassword: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const UpdateUserPasswordSchema = SignUpSchema;

export type UpdateUserPasswordDto = z.infer<typeof UpdateUserPasswordSchema>;

export type SignUpDto = z.infer<typeof SignUpSchema>;

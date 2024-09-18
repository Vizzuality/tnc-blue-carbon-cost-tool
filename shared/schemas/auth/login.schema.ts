import { z } from "zod";
export const EmailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const PasswordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const LogInSchema = z.intersection(EmailSchema, PasswordSchema);

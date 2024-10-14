import { z } from "zod";

// todo: use the one in shared/dtos/users/request-email-update
export const accountDetailsSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

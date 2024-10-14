import { UpdateUserPasswordSchema } from "@shared/schemas/users/update-password.schema";
import { z } from "zod";

export const changePasswordSchema = UpdateUserPasswordSchema.and(
  z.object({
    confirmPassword: UpdateUserPasswordSchema.shape.newPassword,
  }),
).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

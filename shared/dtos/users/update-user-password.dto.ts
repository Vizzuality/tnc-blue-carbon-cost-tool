import { z } from "zod";
import { UpdateUserPasswordSchema } from "@shared/schemas/users/update-password.schema";

export type UpdateUserPasswordDto = z.infer<typeof UpdateUserPasswordSchema>;

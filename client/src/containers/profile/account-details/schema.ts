import { ROLES } from "@shared/entities/users/roles.enum";
import { UpdateUserSchema } from "@shared/schemas/users/update-user.schema";
import { z } from "zod";

export const accountDetailsSchema = UpdateUserSchema.and(
  z.object({
    role: z.enum([ROLES.ADMIN, ROLES.USER]).optional(),
  }),
);

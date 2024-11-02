import { z } from "zod";
import { ROLES } from "@shared/entities/users/roles.enum";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  partnerName: z.string(),
  role: z.nativeEnum(ROLES).optional(),
});

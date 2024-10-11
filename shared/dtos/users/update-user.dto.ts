import { z } from "zod";
import { UpdateUserSchema } from "@shared/schemas/users/update-user.schema";

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

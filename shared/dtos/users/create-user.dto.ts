import { z } from "zod";
import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
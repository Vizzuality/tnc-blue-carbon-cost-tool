import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  partnerName: z.string(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
import { z } from "zod";

export const RequestEmailUpdateSchema = z.object({
  email: z.string().email(),
  newEmail: z.string().email(),
});

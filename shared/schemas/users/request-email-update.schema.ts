import { z } from "zod";

export const RequestEmailUpdateSchema = z.object({
  newEmail: z.string().email(),
});

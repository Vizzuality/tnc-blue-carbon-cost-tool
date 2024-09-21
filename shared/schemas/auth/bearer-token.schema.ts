import { z } from "zod";

export const BearerTokenSchema = z.object({
  authorization: z
    .string()
    .regex(
      /^Bearer\s+(.+)$/,
      'Authorization must be in the format "Bearer XXX"',
    )
    .transform((val) => val.split(" ")[1]),
});

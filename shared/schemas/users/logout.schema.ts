import { z } from "zod";

export const LogoutSchema = z.object({
  refreshToken: z.string(),
});

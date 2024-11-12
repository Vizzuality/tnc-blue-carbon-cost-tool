import { z } from "zod";

export enum TOKEN_TYPE_ENUM {
  ACCESS = "access",
  RESET_PASSWORD = "reset-password",
  ACCOUNT_CONFIRMATION = "sign-up",
  EMAIL_CONFIRMATION = "email-confirmation",
}

export const TokenTypeSchema = z.object({
  tokenType: z.nativeEnum(TOKEN_TYPE_ENUM),
});

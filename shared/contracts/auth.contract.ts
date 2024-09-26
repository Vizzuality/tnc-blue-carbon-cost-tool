import { initContract } from "@ts-rest/core";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { UserWithAccessToken } from "@shared/dtos/user.dto";
import { JSONAPIError } from "@shared/dtos/json-api.error";
import { TokenTypeSchema } from "@shared/schemas/auth/token-type.schema";
import { z } from "zod";
import { BearerTokenSchema } from "@shared/schemas/auth/bearer-token.schema";
import { SignUpSchema } from "@shared/schemas/auth/sign-up.schema";

// TODO: This is a scaffold. We need to define types for responses, zod schemas for body and query param validation etc.

const contract = initContract();
export const authContract = contract.router({
  login: {
    method: "POST",
    path: "/authentication/login",
    responses: {
      201: contract.type<UserWithAccessToken>(),
      401: contract.type<JSONAPIError>(),
    },
    body: LogInSchema,
  },
  signUp: {
    method: "POST",
    path: "/authentication/sign-up",
    responses: {
      201: contract.type<null>(),
      401: contract.type<JSONAPIError>(),
    },
    body: SignUpSchema,
  },
  validateToken: {
    method: "GET",
    path: "/authentication/validate-token",
    headers: BearerTokenSchema,
    responses: {
      200: null,
      401: null,
    },
    query: TokenTypeSchema,
  },
  resetPassword: {
    method: "POST",
    path: "/authentication/reset-password",
    responses: {
      201: null,
      401: null,
    },
    body: z.object({ password: z.string() }),
  },
  requestPasswordRecovery: {
    method: "POST",
    path: "/authentication/recover-password",
    responses: {
      201: null,
      401: null,
    },
    body: z.object({ email: z.string().email() }),
  },
});

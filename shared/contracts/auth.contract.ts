import { initContract } from "@ts-rest/core";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { UserDto, UserWithAccessToken } from "@shared/dtos/users/user.dto";
import { TokenTypeSchema } from "@shared/schemas/auth/token-type.schema";
import { z } from "zod";
import { BearerTokenSchema } from "@shared/schemas/auth/bearer-token.schema";
import { SignUpSchema } from "@shared/schemas/auth/sign-up.schema";
import { RequestEmailUpdateSchema } from "@shared/schemas/users/request-email-update.schema";
import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";

// TODO: This is a scaffold. We need to define types for responses, zod schemas for body and query param validation etc.

const contract = initContract();
export const authContract = contract.router({
  login: {
    method: "POST",
    path: "/authentication/login",
    responses: {
      201: contract.type<UserWithAccessToken>(),
    },
    body: LogInSchema,
  },
  register: {
    method: "POST",
    path: "/authentication/register",
    responses: {
      201: contract.type<null>(),
    },
    body: CreateUserSchema.omit({ role: true }),
  },
  signUp: {
    method: "POST",
    path: "/authentication/sign-up",
    responses: {
      201: contract.type<null>(),
    },
    body: SignUpSchema,
  },
  validateToken: {
    method: "GET",
    path: "/authentication/validate-token",
    headers: BearerTokenSchema,
    responses: {
      200: null,
    },
    query: TokenTypeSchema,
  },
  resetPassword: {
    method: "POST",
    path: "/authentication/reset-password",
    responses: {
      201: null,
    },
    body: z.object({ password: z.string() }),
  },
  requestPasswordRecovery: {
    method: "POST",
    path: "/authentication/recover-password",
    responses: {
      201: null,
    },
    body: z.object({ email: z.string().email() }),
  },

  confirmEmail: {
    method: "PATCH",
    path: "/authentication/confirm-email",
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
    },
    body: RequestEmailUpdateSchema,
  },
});

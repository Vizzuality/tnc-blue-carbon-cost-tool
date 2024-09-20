import { initContract } from "@ts-rest/core";
import { LogInSchema } from "@shared/schemas/auth/login.schema";
import { UserWithAccessToken } from "@shared/dtos/user.dto";
import { JSONAPIError } from "@shared/dtos/json-api.error";
import { TokenTypeSchema } from "@shared/schemas/auth/token-type.schema";

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
  validateToken: {
    method: "GET",
    path: "/authentication/validate-token",
    responses: {
      200: null,
      401: null,
    },
    query: TokenTypeSchema,
  },
});

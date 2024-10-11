import { initContract } from "@ts-rest/core";
import { JSONAPIError } from "@shared/dtos/json-api.error";
import { CreateUserSchema } from "@shared/schemas/users/create-user.schema";

// TODO: This is a scaffold. We need to define types for responses, zod schemas for body and query param validation etc.

const contract = initContract();
export const adminContract = contract.router({
  createUser: {
    method: "POST",
    path: "/admin/users",
    responses: {
      201: contract.type<null>(),
    },
    body: CreateUserSchema,
  },
});

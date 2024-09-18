import { initContract } from "@ts-rest/core";

// TODO: This is a scaffold. We need to define types for responses, zod schemas for body and query param validation etc.

const contract = initContract();
export const authContract = contract.router({
  login: {
    method: "POST",
    path: "/authentication/login",
    responses: {
      200: contract.type<null>(),
      401: contract.type<null>(),
    },
    body: contract.type<{ email: string; password: string }>(),
  },
});

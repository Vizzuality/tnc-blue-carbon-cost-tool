import { initContract } from "@ts-rest/core";
import { adminContract } from "@shared/contracts/admin.contract";
import { authContract } from "@shared/contracts/auth.contract";
import { usersContract } from "@shared/contracts/users.contract";
import { JSONAPIError } from "@shared/dtos/json-api.error";

const contract = initContract();

export const router = contract.router(
  {
    auth: authContract,
    admin: adminContract,
    user: usersContract,
  },
  {
    commonResponses: {
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
      403: contract.type<JSONAPIError>(),
      404: contract.type<JSONAPIError>(),
      500: contract.type<JSONAPIError>(),
    },
    strictStatusCodes: true,
  },
);

const baseRouterConfig = contract.router(
  { authContract, adminContract, usersContract },
  {},
);

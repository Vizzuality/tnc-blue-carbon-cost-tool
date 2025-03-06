import { initContract } from "@ts-rest/core";
import { adminContract } from "@shared/contracts/admin.contract";
import { authContract } from "@shared/contracts/auth.contract";
import { usersContract } from "@shared/contracts/users.contract";
import { JSONAPIError } from "@shared/dtos/json-api.error";
import { projectsContract } from "@shared/contracts/projects.contract";
import { customProjectContract } from "@shared/contracts/custom-projects.contract";
import { methodologyContract } from "@shared/contracts/methodology.contract";

const contract = initContract();

export const router = contract.router(
  {
    auth: authContract,
    admin: adminContract,
    user: usersContract,
    projects: projectsContract,
    customProjects: customProjectContract,
    methodology: methodologyContract,
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

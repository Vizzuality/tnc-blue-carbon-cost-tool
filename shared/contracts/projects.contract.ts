import { initContract } from "@ts-rest/core";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { z } from "zod";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { Project } from "@shared/entities/projects.entity";
import { User } from "@shared/entities/users/user.entity";

const contract = initContract();
export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<ApiPaginationResponse<Project>>(),
    },
    query: generateEntityQuerySchema(Project),
  },
  getProject: {
    method: "GET",
    path: "/projects/:id",
    pathParams: z.object({
      id: z.coerce.string().uuid(),
    }),
    responses: {
      200: contract.type<ApiResponse<Project>>(),
    },
    query: generateEntityQuerySchema(Project),
  },
});

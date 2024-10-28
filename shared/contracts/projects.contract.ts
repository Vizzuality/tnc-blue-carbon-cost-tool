import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { Project } from "@shared/entities/projects.entity";
import { FetchSpecification } from "nestjs-base-service";
import { CountryWithNoGeometry } from "@shared/entities/country.entity";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";

const contract = initContract();
export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<ApiPaginationResponse<Project>>(),
    },
    //query: contract.type<FetchSpecification>(),
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
    //query: contract.type<FetchSpecification>(),
    query: generateEntityQuerySchema(Project),
  },
  getProjectCountries: {
    method: "GET",
    path: "/projects/countries",
    responses: {
      200: contract.type<ApiResponse<CountryWithNoGeometry[]>>(),
    },
  },
});

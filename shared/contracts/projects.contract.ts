import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { Project } from "@shared/entities/projects.entity";
import { FetchSpecification } from "nestjs-base-service";
import { CountryWithNoGeometry } from "@shared/entities/country.entity";
import {
  ProjectMap,
  ProjectMapFilters,
} from "@shared/dtos/projects/projects-map.dto";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";

const contract = initContract();

export const projectsQuerySchema = generateEntityQuerySchema(Project);
export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<ApiPaginationResponse<Project>>(),
    },
    query: projectsQuerySchema,
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
    query: projectsQuerySchema,
  },
  getProjectCountries: {
    method: "GET",
    path: "/projects/countries",
    responses: {
      200: contract.type<ApiResponse<CountryWithNoGeometry[]>>(),
    },
  },
  getProjectsMap: {
    method: "GET",
    path: "/projects/map",
    responses: {
      200: contract.type<ProjectMap>(),
    },
    // TODO: we need to define filters, they should probably match filters for Projects. Or we might want to pass only project ids, which
    //       would be already filtered
    //query: z.object({ countryCodes: z.string().array().optional() }).optional(),
    query: projectsQuerySchema.pick({ filter: true }),
  },
});

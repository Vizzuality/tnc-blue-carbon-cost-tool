import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { COST_TYPE_SELECTOR, Project } from "@shared/entities/projects.entity";
import { CountryWithNoGeometry } from "@shared/entities/country.entity";
import { ProjectMap } from "@shared/dtos/projects/projects-map.dto";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { BaseEntity } from "typeorm";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";
import { PaginatedProjectsWithMaximums } from "@shared/dtos/projects/projects.dto";
import { ProjectScorecardDto } from "@shared/dtos/projects/project-scorecard.dto";
import { ProjectKeyCostsView } from "@shared/entities/project-key-costs.view";

const contract = initContract();

export type ProjectType = Omit<Project, keyof BaseEntity>;

export const otherParams = z.object({
  costRange: z.coerce.number().array().optional(),
  abatementPotentialRange: z.coerce.number().array().optional(),
  costRangeSelector: z.nativeEnum(COST_TYPE_SELECTOR).optional(),
  partialProjectName: z.string().optional(),
  withMaximums: z.coerce.boolean().optional(),
});
export const projectsQuerySchema = generateEntityQuerySchema(Project);
export const projectQuerySchema =
  generateEntityQuerySchema(ProjectScorecardDto);
export const projectScorecardQuerySchema =
  generateEntityQuerySchema(ProjectScorecardView);

export const getProjectsQuerySchema = projectsQuerySchema.merge(otherParams);
export const getProjectScorecardQuerySchema =
  projectScorecardQuerySchema.merge(otherParams);

export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<
        ApiPaginationResponse<Project> | PaginatedProjectsWithMaximums
      >(),
    },
    query: getProjectsQuerySchema,
  },
  getProjectsScorecard: {
    method: "GET",
    path: "/projects/scorecard",
    responses: {
      200: contract.type<ApiPaginationResponse<ProjectScorecardView>>(),
    },
    query: getProjectScorecardQuerySchema,
  },
  getProjectsKeyCosts: {
    method: "GET",
    path: "/projects/key-costs",
    responses: {
      200: contract.type<ApiPaginationResponse<ProjectKeyCostsView>>(),
    },
    query: getProjectsQuerySchema,
  },
  getProject: {
    method: "GET",
    path: "/projects/:id",
    pathParams: z.object({
      id: z.coerce.string().uuid(),
    }),
    responses: {
      200: contract.type<ApiResponse<ProjectScorecardDto>>(),
    },
    query: projectQuerySchema,
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
    query: getProjectsQuerySchema.pick({
      filter: true,
      costRange: true,
      abatementPotentialRange: true,
      costRangeSelector: true,
      partialProjectName: true,
    }),
  },
});

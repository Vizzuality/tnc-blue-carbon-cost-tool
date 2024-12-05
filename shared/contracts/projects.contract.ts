import { ProjectScorecard } from "./../entities/project-scorecard.entity";
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

const contract = initContract();

export type ProjectType = Omit<Project, keyof BaseEntity>;
export type ProjectScorecardType = Omit<ProjectScorecard, keyof BaseEntity>;

export const otherFilters = z.object({
  costRange: z.coerce.number().array().optional(),
  abatementPotentialRange: z.coerce.number().array().optional(),
  costRangeSelector: z.nativeEnum(COST_TYPE_SELECTOR).optional(),
  partialProjectName: z.string().optional(),
});
export const projectsQuerySchema = generateEntityQuerySchema(Project);
export const projectScorecardQuerySchema =
  generateEntityQuerySchema(ProjectScorecard);

export const getProjectsQuerySchema = projectsQuerySchema.merge(otherFilters);
export const getProjectScorecardQuerySchema =
  projectScorecardQuerySchema.merge(otherFilters);

export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<ApiPaginationResponse<Project>>(),
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
    query: getProjectsQuerySchema.pick({
      filter: true,
      costRange: true,
      abatementPotentialRange: true,
      costRangeSelector: true,
    }),
  },
});

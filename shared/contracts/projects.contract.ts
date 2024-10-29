import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { Project } from "@shared/entities/projects.entity";
import { FetchSpecification } from "nestjs-base-service";
import { CountryWithNoGeometry } from "@shared/entities/country.entity";
import { FeatureCollection, Geometry } from "geojson";
import { ProjectGeoProperties } from "@shared/schemas/geometries/projects";
import { ProjectMap } from "@shared/dtos/projects/projects-map.dto";

const contract = initContract();
export const projectsContract = contract.router({
  getProjects: {
    method: "GET",
    path: "/projects",
    responses: {
      200: contract.type<ApiPaginationResponse<Project>>(),
    },
    query: contract.type<FetchSpecification>(),
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
    query: contract.type<FetchSpecification>(),
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
  },
});

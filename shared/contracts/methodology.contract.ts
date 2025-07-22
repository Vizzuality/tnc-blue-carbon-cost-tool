import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { MethodologySourcesDto } from "@shared/dtos/methodology/methodology-sources.dto";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { Changelog } from "@shared/entities/model-versioning/changelog.type";
import { DataIngestionEntity } from "@shared/entities/model-versioning/data-ingestion.entity";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { initContract } from "@ts-rest/core";

const contract = initContract();
export const methodologyContract = contract.router({
  getAllModelAssumptions: {
    method: "GET",
    path: "/methodology/model-assumptions",
    responses: {
      200: contract.type<ApiResponse<ModelAssumptions[]>>(),
    },
    summary: "Get all model assumptions",
  },
  getMethodologySources: {
    method: "GET",
    path: "/methodology/sources",
    query: null,
    responses: {
      200: contract.type<ApiResponse<MethodologySourcesDto>>(),
    },
    summary: "Get all the sources for the methodology table",
  },
  getChangeLogs: {
    method: "GET",
    path: "/methodology/changelogs",
    query: generateEntityQuerySchema(DataIngestionEntity),
    responses: {
      200: contract.type<ApiPaginationResponse<Changelog>>(),
    },
  },
});

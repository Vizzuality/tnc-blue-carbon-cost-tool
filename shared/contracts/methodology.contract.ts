import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { MethodologySourcesDto } from "@shared/dtos/methodology/methodology-sources.dto";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
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
});

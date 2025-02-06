import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { MethodologySourcesDto } from "@shared/dtos/methodology/methodology-sources.dto";
import { initContract } from "@ts-rest/core";

const contract = initContract();
export const methodologyContract = contract.router({
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

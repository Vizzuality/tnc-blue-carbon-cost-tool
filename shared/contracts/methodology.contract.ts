import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { MethodologySource } from "@shared/entities/methodology/methodology-source.entity";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { initContract } from "@ts-rest/core";

export const methodologySourcesQuerySchema =
  generateEntityQuerySchema(MethodologySource);

const contract = initContract();
export const methodologyContract = contract.router({
  getMethodologySources: {
    method: "GET",
    path: "/methodology/sources",
    query: methodologySourcesQuerySchema,
    responses: {
      200: contract.type<ApiResponse<Partial<MethodologySource>[]>>(),
    },
    summary: "Get all the sources for the methodology table",
  },
});

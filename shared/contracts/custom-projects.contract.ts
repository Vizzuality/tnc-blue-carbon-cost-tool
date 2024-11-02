import { initContract } from "@ts-rest/core";
import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { Country } from "@shared/entities/country.entity";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";

// TODO: This is a scaffold. We need to define types for responses, zod schemas for body and query param validation etc.

const contract = initContract();
export const customProjectContract = contract.router({
  getAvailableCountries: {
    method: "GET",
    path: "/custom-projects/available-countries",
    responses: {
      201: contract.type<ApiResponse<Pick<Country, "name" | "code">>>(),
    },
    summary: "Get available countries to create a custom project",
  },
  // TODO: This should go in another controller, probably methodology controller. according to the design
  getDefaultAssumptions: {
    method: "GET",
    path: "/custom-projects/assumptions",
    responses: {
      200: contract.type<ApiResponse<ModelAssumptions[]>>(),
    },
    summary: "Get default model assumptions",
  },
});

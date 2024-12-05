import { initContract } from "@ts-rest/core";
import {
  ApiPaginationResponse,
  ApiResponse,
  ErrorResponse,
} from "@shared/dtos/global/api-response.dto";
import { Country } from "@shared/entities/country.entity";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { CreateCustomProjectDto } from "@api/modules/custom-projects/dto/create-custom-project-dto";
import { GetDefaultCostInputsSchema } from "@shared/schemas/custom-projects/get-cost-inputs.schema";
import { OverridableCostInputs } from "@api/modules/custom-projects/dto/project-cost-inputs.dto";
import { GetAssumptionsSchema } from "@shared/schemas/assumptions/get-assumptions.schema";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";

export const customProjecsQuerySchema =
  generateEntityQuerySchema(CustomProject);

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
      200: contract.type<ApiResponse<Partial<ModelAssumptions>>>(),
    },
    query: GetAssumptionsSchema,
    summary: "Get default model assumptions",
  },
  getDefaultCostInputs: {
    method: "GET",
    path: "/custom-projects/cost-inputs",
    responses: {
      200: contract.type<ApiResponse<OverridableCostInputs>>(),
    },
    query: GetDefaultCostInputsSchema,
  },
  createCustomProject: {
    method: "POST",
    path: "/custom-projects",
    responses: {
      201: contract.type<ApiResponse<CustomProject>>(),
    },
    body: contract.type<CreateCustomProjectDto>(),
  },
  getCustomProjects: {
    method: "GET",
    path: "/custom-projects",
    query: customProjecsQuerySchema,
    responses: {
      200: contract.type<ApiPaginationResponse<CustomProject>>(),
    },
  },
  getCustomProject: {
    method: "GET",
    path: "/custom-projects/:id",
    query: customProjecsQuerySchema,
    responses: {
      200: contract.type<ApiResponse<CustomProject>>(),
    },
  },
  saveCustomProject: {
    method: "POST",
    path: "/custom-projects/save",
    responses: {
      201: contract.type<null>(),
    },
    body: contract.type<CustomProject>(),
  },
});

// TODO: Due to dificulties crafting a deeply nested conditional schema, I will go forward with nestjs custom validation pipe for now

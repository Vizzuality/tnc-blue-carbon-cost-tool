import { initContract } from "@ts-rest/core";
import {
  ApiPaginationResponse,
  ApiResponse,
} from "@shared/dtos/global/api-response.dto";
import { Country } from "@shared/entities/country.entity";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { GetDefaultCostInputsSchema } from "@shared/schemas/custom-projects/get-cost-inputs.schema";
import { GetAssumptionsSchema } from "@shared/schemas/assumptions/get-assumptions.schema";

import {
  CreateCustomProjectSchema,
  InputCostsSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { ActivityTypesDefaults } from "@shared/dtos/custom-projects/activity-types-defaults";
import { GetActivityTypesDefaultsSchema } from "@shared/schemas/custom-projects/activity-types-defaults.schema";

export const customProjecsQuerySchema = generateEntityQuerySchema(
  CustomProject,
).merge(
  z.object({
    partialProjectName: z.string().optional(),
  }),
);

const contract = initContract();
export const customProjectContract = contract.router({
  getActivityTypesDefaults: {
    method: "GET",
    path: "/custom-projects/activity-types-defaults",
    query: GetActivityTypesDefaultsSchema,
    responses: {
      200: contract.type<ApiResponse<ActivityTypesDefaults>>(),
    },
    summary:
      "Get default values for fields based on the selected country and ecosystem",
  },
  getAvailableCountries: {
    method: "GET",
    path: "/custom-projects/available-countries",
    responses: {
      201: contract.type<ApiResponse<Pick<Country, "name" | "code">[]>>(),
    },
    summary: "Get available countries to create a custom project",
  },
  // TODO: This should go in another controller, probably methodology controller. according to the design
  getDefaultAssumptions: {
    method: "GET",
    path: "/custom-projects/assumptions",
    responses: {
      200: contract.type<ApiResponse<Partial<ModelAssumptions>[]>>(),
    },
    query: GetAssumptionsSchema,
    summary: "Get default model assumptions",
  },
  getDefaultCostInputs: {
    method: "GET",
    path: "/custom-projects/cost-inputs",
    responses: {
      200: contract.type<ApiResponse<z.infer<typeof InputCostsSchema>>>(),
    },
    query: GetDefaultCostInputsSchema,
  },
  createCustomProject: {
    method: "POST",
    path: "/custom-projects",
    responses: {
      201: contract.type<ApiResponse<CustomProject>>(),
    },
    body: CreateCustomProjectSchema,
  },
  updateCustomProject: {
    method: "PATCH",
    path: "/custom-projects/:id",
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<CustomProject>(),
    },
    body: contract.type<Partial<CustomProject>>(),
    summary: "Update an existing custom-project",
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
      201: contract.type<ApiResponse<{ id: string }>>(),
    },
    body: contract.type<CustomProject>(),
  },
  deleteCustomProjects: {
    method: "DELETE",
    path: "/custom-projects",
    responses: {
      200: contract.type<null>(),
    },
    body: contract.type<{ ids: string[] }>(),
  },
});

// TODO: Due to dificulties crafting a deeply nested conditional schema, I will go forward with nestjs custom validation pipe for now

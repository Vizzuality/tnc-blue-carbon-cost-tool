import { initContract } from "@ts-rest/core";
import { generateEntityQuerySchema } from "@shared/schemas/query-param.schema";
import { User } from "@shared/entities/users/user.entity";
import { UserDto } from "@shared/dtos/users/user.dto";
import { z } from "zod";
import { JSONAPIError } from "@shared/dtos/json-api.error";

import { ApiResponse } from "@shared/dtos/global/api-response.dto";
import { UpdateUserPasswordSchema } from "@shared/schemas/users/update-password.schema";
import { RequestEmailUpdateSchema } from "@shared/schemas/users/request-email-update.schema";
import { UpdateUserSchema } from "@shared/schemas/users/update-user.schema";
import { UploadDataFilesDto } from "@shared/dtos/users/upload-data-files.dto";

const contract = initContract();
export const usersContract = contract.router({
  findMe: {
    method: "GET",
    path: "/users/me",
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      401: contract.type<JSONAPIError>(),
    },
    query: generateEntityQuerySchema(User),
  },
  updateMe: {
    method: "PATCH",
    path: "/users",
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
    },
    body: UpdateUserSchema,
    summary: "Update an existing user",
  },
  updatePassword: {
    method: "PATCH",
    path: "/users/me/password",
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
    },
    body: UpdateUserPasswordSchema,
    summary: "Update password of the user",
  },
  requestEmailUpdate: {
    method: "PATCH",
    path: "/users/me/email",
    responses: {
      200: contract.type<null>(),
    },
    body: RequestEmailUpdateSchema,
  },
  deleteMe: {
    method: "DELETE",
    path: "/users/me",
    responses: {
      200: null,
    },
    body: null,
  },
  uploadData: {
    method: "POST",
    path: "/users/upload-data",
    responses: {
      201: contract.type<any>(),
    },
    contentType: "multipart/form-data",
    body: contract.type<UploadDataFilesDto>(),
  },
  deleteUploadedData: {
    method: "DELETE",
    path: "/users/upload-data/:id",
    responses: {
      204: contract.type<null>(),
    },
  },
  listUploadDataTemplates: {
    method: "GET",
    path: "/users/upload-data/templates",
    responses: {
      200: contract.type<any>(),
    },
  },
  downloadUploadDataTemplate: {
    method: "GET",
    path: "/users/upload-data/templates/:templateId",
    responses: {
      200: contract.type<any>(),
    },
  },
});

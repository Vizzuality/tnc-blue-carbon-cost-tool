import { initContract } from "@ts-rest/core";
import { JSONAPIError } from "@shared/dtos/json-api.error";
import { generateEntityQuerySchema } from '@shared/schemas/query-param.schema';
import { User } from '@shared/entities/users/user.entity';
import { UserDto } from '@shared/dtos/users/user.dto';
import { UpdateUserPasswordDto } from '@shared/dtos/users/update-user-password.dto';
import { z } from 'zod';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';
import { PasswordSchema } from '@shared/schemas/auth/login.schema';

import {
  ApiResponse,
} from '@shared/dtos/global/api-response.dto';

const contract = initContract();
export const usersContract = contract.router({
  findMe: {
    method: 'GET',
    path: '/users/me',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      401: contract.type<JSONAPIError>(),
    },
    query: generateEntityQuerySchema(User),
  },
  updateUser: {
    method: 'PATCH',
    path: '/users/:id',
    pathParams: z.object({
      id: z.coerce.string(),
    }),
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<UpdateUserDto>(),
    summary: 'Update an existing user',
  },
  updatePassword: {
    method: 'PATCH',
    path: '/users/me/password',
    responses: {
      200: contract.type<ApiResponse<UserDto>>(),
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: contract.type<UpdateUserPasswordDto>(),
    summary: 'Update password of the user',
  },
  deleteMe: {
    method: 'DELETE',
    path: '/users/me',
    responses: {
      200: null,
      400: contract.type<JSONAPIError>(),
      401: contract.type<JSONAPIError>(),
    },
    body: null,
  },
  resetPassword: {
    method: 'POST',
    path: '/users/me/password/reset',
    responses: {
      200: contract.type<null>(),
      400: contract.type<JSONAPIError>(),
    },
    body: PasswordSchema,
  },
});

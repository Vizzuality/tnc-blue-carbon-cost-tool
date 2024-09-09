import { SetMetadata } from '@nestjs/common';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: ROLES[]) =>
  SetMetadata(ROLES_KEY, roles);

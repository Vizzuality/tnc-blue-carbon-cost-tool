import { SetMetadata } from '@nestjs/common';
import { ROLES } from '@shared/entities/users/roles.enum';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: ROLES[]) =>
  SetMetadata(ROLES_KEY, roles);

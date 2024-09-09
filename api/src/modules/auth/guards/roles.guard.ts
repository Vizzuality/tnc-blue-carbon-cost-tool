import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ROLES,
  ROLES_HIERARCHY,
} from '@api/modules/auth/authorisation/roles.enum';
import { ROLES_KEY } from '@api/modules/auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: ROLES[] = this.reflector.getAllAndOverride<ROLES[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return this.hasRequiredRole(user.role, requiredRoles);
  }

  private hasRequiredRole(userRole: ROLES, requiredRoles: ROLES[]): boolean {
    return requiredRoles.some(
      (requiredRole) =>
        userRole === requiredRole ||
        ROLES_HIERARCHY[userRole]?.includes(requiredRole),
    );
  }
}

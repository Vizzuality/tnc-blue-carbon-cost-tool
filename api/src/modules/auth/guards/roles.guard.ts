import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@api/modules/auth/roles.enum';

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
    return requiredRoles.some((role) => userRole === role);
  }
}

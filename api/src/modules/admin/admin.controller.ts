import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { adminContract } from '@shared/contracts/admin.contract';
import { AuthenticationService } from '@api/modules/auth/authentication.service';
import { ROLES } from '@shared/entities/users/roles.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly auth: AuthenticationService) {}

  @RequiredRoles(ROLES.ADMIN)
  @TsRestHandler(adminContract.createUser)
  async createUser(): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.createUser, async ({ body }) => {
      await this.auth.createUser(body);
      return {
        status: 201,
        body: null,
      };
    });
  }
}

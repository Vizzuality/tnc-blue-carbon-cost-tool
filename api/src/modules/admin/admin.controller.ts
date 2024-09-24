import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { adminContract } from '@shared/contracts/admin.contract';

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

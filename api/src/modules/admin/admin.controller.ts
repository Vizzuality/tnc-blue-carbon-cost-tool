import { Controller, Headers, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { adminContract } from '@shared/contracts/admin.contract';
import { AuthenticationService } from '@api/modules/auth/authentication.service';
import { ROLES } from '@shared/entities/users/roles.enum';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';

@Controller()
@UseGuards(JwtCookieAuthGuard, RolesGuard)
@RequiredRoles(ROLES.ADMIN)
export class AdminController {
  constructor(private readonly auth: AuthenticationService) {}

  @TsRestHandler(adminContract.addUser)
  async addUser(
    @Headers('origin') origin: string,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.addUser, async ({ body }) => {
      await this.auth.addUser(origin, body);
      return {
        status: 201,
        body: null,
      };
    });
  }
}

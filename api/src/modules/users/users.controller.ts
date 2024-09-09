import { Controller, Get } from '@nestjs/common';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';

@Controller('users')
export class UsersController {
  // TODO: All of these endpoints are fake, only to test the role guard

  @RequiredRoles(ROLES.ADMIN)
  @Get('admin')
  async createUserAsAdmin() {
    return [ROLES.ADMIN];
  }

  @RequiredRoles(ROLES.PARTNER)
  @Get('partner')
  async createUserAsPartner() {
    return [ROLES.PARTNER, ROLES.ADMIN];
  }

  @RequiredRoles(ROLES.GENERAL_USER)
  @Get('user')
  async createUserAsUser() {
    return [ROLES.GENERAL_USER, ROLES.PARTNER, ROLES.ADMIN];
  }
}

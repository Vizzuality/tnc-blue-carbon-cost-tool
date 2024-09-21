import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { CreateUserDto } from '@shared/schemas/users/create-user.schema';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly auth: AuthenticationService) {}

  @RequiredRoles(ROLES.ADMIN)
  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.auth.createUser(createUserDto);
  }
}

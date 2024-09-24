import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { CreateUserDto } from '@shared/schemas/users/create-user.schema';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly auth: AuthenticationService) {}

  @RequiredRoles(ROLES.ADMIN)
  @Post('/users')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.auth.createUser(createUserDto);
  }
}

import {
  ClassSerializerInterceptor,
  Controller,
  Headers,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { usersContract } from '@shared/contracts/users.contract';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { AuthenticationService } from '@api/modules/auth/authentication.service';
import { ControllerResponse } from '@api/types/controller-response.type';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private auth: AuthenticationService,
  ) {}

  @TsRestHandler(usersContract.findMe)
  async findMe(@GetUser() user: User): ControllerResponse {
    return tsRestHandler(usersContract.findMe, async ({ query }) => {
      const foundUser = await this.usersService.getById(user.id, query);
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      return { body: { data: foundUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(usersContract.updatePassword)
  async updatePassword(@GetUser() user: User): ControllerResponse {
    return tsRestHandler(usersContract.updatePassword, async ({ body }) => {
      const updatedUser = await this.auth.updatePassword(user, body);
      return { body: { data: updatedUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(usersContract.updateMe)
  async update(@GetUser() user: User): ControllerResponse {
    return tsRestHandler(usersContract.updateMe, async ({ body }) => {
      const updatedUser = await this.usersService.update(user.id, body);
      return { body: { data: updatedUser }, status: HttpStatus.CREATED };
    });
  }

  @TsRestHandler(usersContract.requestEmailUpdate)
  async requestEmailUpdate(
    @GetUser() user: User,
    @Headers('origin') origin: string,
  ): ControllerResponse {
    return tsRestHandler(usersContract.requestEmailUpdate, async ({ body }) => {
      await this.auth.requestEmailUpdate(user, body, origin);
      return { body: null, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(usersContract.deleteMe)
  async deleteMe(@GetUser() user: User): Promise<any> {
    return tsRestHandler(usersContract.deleteMe, async () => {
      await this.usersService.remove(user.id);
      return { body: null, status: HttpStatus.OK };
    });
  }
}

import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { usersContract as c } from '@shared/contracts/users.contract';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { AuthenticationService } from '@api/modules/auth/authentication.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private auth: AuthenticationService,
  ) {}

  @TsRestHandler(c.findMe)
  async findMe(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.findMe, async ({ query }) => {
      const foundUser = await this.usersService.getById(user.id, query);
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      return { body: { data: foundUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updatePassword)
  async updatePassword(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.updatePassword, async ({ body }) => {
      const updatedUser = await this.auth.updatePassword(user, body);
      return { body: { data: updatedUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updateMe)
  async update(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.updateMe, async ({ body }) => {
      const updatedUser = await this.usersService.update(user.id, body);
      return { body: { data: updatedUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.deleteMe)
  async deleteMe(@GetUser() user: User): Promise<any> {
    return tsRestHandler(c.deleteMe, async () => {
      await this.usersService.remove(user.id);
      return { body: null, status: HttpStatus.OK };
    });
  }
}

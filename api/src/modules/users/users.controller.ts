import {
  Controller,
  ClassSerializerInterceptor,
  Body,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { GetUser } from '@api/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { usersContract as c } from '@shared/contracts/users.contract';

import { UpdateUserPasswordDto } from '@shared/dtos/users/update-user-password.dto';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

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
  async updatePassword(
    @Body() dto: UpdateUserPasswordDto['newPassword'],
    @GetUser() user: User,
  ): Promise<any> {
    return tsRestHandler(c.updatePassword, async () => {
      const updatedUser = await this.usersService.updatePassword(user, dto);
      return { body: { data: updatedUser }, status: HttpStatus.OK };
    });
  }

  @TsRestHandler(c.updateUser)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<any> {
    return tsRestHandler(c.updateUser, async () => {
      const user = await this.usersService.update(id, dto);
      //return { body: { data: user }, status: HttpStatus.CREATED };
      return { body: { data: user }, status: HttpStatus.CREATED };
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

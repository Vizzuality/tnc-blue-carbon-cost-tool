import { OmitType } from "@nestjs/mapped-types";
import { User } from "@shared/entities/users/user.entity";

export type UserWithAccessToken = {
  user: UserDto;
  accessToken: string;
};

export class UserDto extends OmitType(User, ["password"]) {}

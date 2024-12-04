import { OmitType } from "@nestjs/mapped-types";
import { BackOfficeSession } from "@shared/entities/users/backoffice-session";
import { User } from "@shared/entities/users/user.entity";

export type UserWithAccessToken = {
  user: UserDto;
  accessToken: string;
  backofficeSession?: BackOfficeSession
};

export class UserDto extends OmitType(User, ["password"]) {}

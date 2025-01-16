import { OmitType } from "@nestjs/mapped-types";
import { BackOfficeSession } from "@shared/entities/users/backoffice-session";
import { User } from "@shared/entities/users/user.entity";

export type UserWithAuthTokens = {
  user: UserDto;
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  backofficeSession?: BackOfficeSession;
};

export class UserDto extends OmitType(User, ["password"]) {}

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@api/modules/users/users.service';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';

export type JwtPayload = { id: string };

export const SignUp = 'sign-up';

@Injectable()
export class SignUpStrategy extends PassportStrategy(Strategy, SignUp) {
  constructor(
    private readonly userService: UsersService,
    private readonly config: ApiConfigService,
  ) {
    const { secret } = config.getJWTConfigByType(TOKEN_TYPE_ENUM.SIGN_UP);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userService.findOneBy(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@api/modules/users/users.service';
import { ApiConfigService } from '@api/modules/config/app-config.service';

export type JwtPayload = { id: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly config: ApiConfigService,
  ) {
    const { secret } = config.getJWTConfig();
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

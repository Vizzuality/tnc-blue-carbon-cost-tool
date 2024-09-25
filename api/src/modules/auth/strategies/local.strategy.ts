import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';
import { User } from '@shared/entities/users/user.entity';
import { AuthenticationService } from '@api/modules/auth/authentication.service';

/**
 * @description: LocalStrategy is used by passport to authenticate by email and password rather than a token.
 */

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User | null = await this.authService.validateUser(
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

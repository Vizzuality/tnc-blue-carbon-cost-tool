import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { JwtPayload } from '@api/modules/auth/strategies/jwt.strategy';
import { UsersService } from '@api/modules/users/users.service';

@Injectable()
export class JwtManager {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ApiConfigService,
    private readonly users: UsersService,
  ) {}

  private sign(userId: string, tokenType: TOKEN_TYPE_ENUM): Promise<string> {
    const { secret, expiresIn } = this.config.getJWTConfigByType(tokenType);
    return this.jwt.signAsync({ id: userId }, { secret, expiresIn });
  }

  private decode(
    token: string,
    tokenType: TOKEN_TYPE_ENUM,
  ): Promise<JwtPayload> {
    const { secret } = this.config.getJWTConfigByType(tokenType);
    return this.jwt.verifyAsync(token, { secret });
  }

  async signAccessToken(userId: string): Promise<{ accessToken: string }> {
    const accessToken = await this.sign(userId, TOKEN_TYPE_ENUM.ACCESS);
    return {
      accessToken,
    };
  }

  async signResetPasswordToken(
    userId: string,
  ): Promise<{ resetPasswordToken: string }> {
    const resetPasswordToken = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.RESET_PASSWORD,
    );
    return {
      resetPasswordToken,
    };
  }

  async signEmailConfirmationToken(
    userId: string,
  ): Promise<{ emailConfirmationToken: string }> {
    const emailConfirmationToken = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
    );
    return {
      emailConfirmationToken,
    };
  }

  async decodeAccessToken(token: string): Promise<JwtPayload> {
    return this.decode(token, TOKEN_TYPE_ENUM.ACCESS);
  }

  async decodeResetPasswordToken(token: string): Promise<JwtPayload> {
    return this.decode(token, TOKEN_TYPE_ENUM.RESET_PASSWORD);
  }

  async decodeEmailConfirmationToken(token: string): Promise<JwtPayload> {
    return this.decode(token, TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION);
  }
}

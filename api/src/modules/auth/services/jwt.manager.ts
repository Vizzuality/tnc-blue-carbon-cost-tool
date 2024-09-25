import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { UsersService } from '@api/modules/users/users.service';

@Injectable()
export class JwtManager {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ApiConfigService,
    private readonly users: UsersService,
  ) {}

  private async sign(
    userId: string,
    tokenType: TOKEN_TYPE_ENUM,
  ): Promise<{ token: string; expiresIn: string }> {
    const { secret, expiresIn } = this.config.getJWTConfigByType(tokenType);
    const token = await this.jwt.signAsync(
      { id: userId },
      { secret, expiresIn },
    );
    return {
      token,
      expiresIn,
    };
  }

  async signAccessToken(
    userId: string,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    const { token: accessToken, expiresIn } = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.ACCESS,
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  async signResetPasswordToken(
    userId: string,
  ): Promise<{ resetPasswordToken: string; expiresIn: string }> {
    const { token: resetPasswordToken, expiresIn } = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.RESET_PASSWORD,
    );
    return {
      resetPasswordToken,
      expiresIn,
    };
  }

  async signEmailConfirmationToken(
    userId: string,
  ): Promise<{ emailConfirmationToken: string; expiresIn: string }> {
    const { token: emailConfirmationToken, expiresIn } = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
    );
    return {
      emailConfirmationToken,
      expiresIn,
    };
  }

  async isTokenValid(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    const { secret } = this.config.getJWTConfigByType(type);
    try {
      const { id } = await this.jwt.verifyAsync(token, { secret });
      switch (type) {
        case TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION:
          /**
           * If the user is already active, we don't want to allow them to confirm their email again.
           */
          return !(await this.users.isUserActive(id));
        default:
          break;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { UsersService } from '@api/modules/users/users.service';
import { TimeUtils } from '@api/utils/time.utils';
import { AuthTokenPair } from '@shared/dtos/auth-token-pair.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  IssuedRefreshToken,
  IssuedRefreshTokenStatus,
} from '@api/modules/auth/entities/issued-refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtManager {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ApiConfigService,
    private readonly users: UsersService,
    @InjectRepository(IssuedRefreshToken)
    private readonly refreshTokenRepository: Repository<IssuedRefreshToken>,
  ) {}

  public async refreshAuthTokens(refreshToken: string): Promise<AuthTokenPair> {
    let sub: string, jti: string;
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getJWTConfigByType(TOKEN_TYPE_ENUM.REFRESH).secret,
      });
      sub = payload.sub;
      jti = payload.jti;
    } catch (error) {
      throw new UnauthorizedException('invalid_refresh_token');
    }

    if ((await this.users.isUserActive(sub)) === false) {
      throw new UnauthorizedException('invalid_refresh_token');
    }

    const issuedRefreshToken = await this.refreshTokenRepository.findOneBy({
      id: jti,
      user: { id: sub },
      status: IssuedRefreshTokenStatus.VALID,
    });
    if (issuedRefreshToken === null) {
      throw new UnauthorizedException('invalid_refresh_token');
    }

    issuedRefreshToken.status = IssuedRefreshTokenStatus.USED;
    issuedRefreshToken.modifiedAt = new Date();
    this.refreshTokenRepository.save(issuedRefreshToken);
    return this.createAuthTokenPair(sub);
  }

  public async createAuthTokenPair(userId: string): Promise<AuthTokenPair> {
    const [accessTokenData, refreshTokenData] = await Promise.all([
      this.signAccessToken(userId),
      this.createRefreshToken(userId),
    ]);

    return {
      ...accessTokenData,
      ...refreshTokenData,
    };
  }

  public async signAccessToken(
    userId: string,
  ): Promise<{ accessToken: string; expiresAt: number }> {
    const { secret, expiresIn } = this.config.getJWTConfigByType(
      TOKEN_TYPE_ENUM.ACCESS,
    );

    const expiresInSeconds = TimeUtils.parseDurationToSeconds(expiresIn);
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    const accessToken = await this.jwt.signAsync(
      {
        id: userId, // Potential breaking changes if we change this to sub?
        aud: 'api',
        iat: Math.floor(Date.now() / 1000),
        // exp is set by the library
      },
      { secret, algorithm: 'HS256', expiresIn: expiresInSeconds },
    );
    return {
      accessToken,
      expiresAt,
    };
  }

  private async createRefreshToken(
    userId: string,
  ): Promise<{ refreshToken: string; refreshTokenExpiresAt: number }> {
    const { secret, expiresIn } = this.config.getJWTConfigByType(
      TOKEN_TYPE_ENUM.REFRESH,
    );

    const jti = uuidv4();
    const iat = Math.floor(Date.now() / 1000);
    const expiresInSeconds = TimeUtils.parseDurationToSeconds(expiresIn);
    const expiresAt = Date.now() + expiresInSeconds * 1000;

    const token = await this.jwt.signAsync(
      {
        jti,
        sub: userId,
        aud: 'api',
        iat,
        // exp is set by the library
      },
      { secret, algorithm: 'HS256', expiresIn: expiresInSeconds },
    );

    await this.refreshTokenRepository.insert({
      id: jti,
      user: { id: userId },
      status: IssuedRefreshTokenStatus.VALID,
      issuedAt: new Date(iat * 1000),
      expiresAt: new Date(expiresAt),
    });
    return {
      refreshToken: token,
      refreshTokenExpiresAt: expiresAt,
    };
  }

  public async logoutUserWithRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    let sub: string, jti: string;
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getJWTConfigByType(TOKEN_TYPE_ENUM.REFRESH).secret,
      });
      sub = payload.sub;
      jti = payload.jti;
    } catch (error) {
      throw new UnauthorizedException('invalid_refresh_token');
    }

    await this.refreshTokenRepository.update(
      { id: jti, user: { id: sub } },
      { status: IssuedRefreshTokenStatus.REVOKED, modifiedAt: new Date() },
    );

    return sub;
  }

  private async sign(
    userId: string,
    tokenType: TOKEN_TYPE_ENUM,
  ): Promise<{ token: string; expiresIn: string }> {
    const { secret, expiresIn } = this.config.getJWTConfigByType(tokenType);
    const token = await this.jwt.signAsync(
      { id: userId },
      { secret, expiresIn, algorithm: 'HS256' }, // Default algorithm
    );
    return {
      token,
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

  async signSignUpToken(
    userId: string,
  ): Promise<{ signUpToken: string; expiresIn: string }> {
    const { token: signUpToken, expiresIn } = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION,
    );
    return {
      signUpToken: signUpToken,
      expiresIn,
    };
  }

  async signEmailUpdateToken(
    userId: string,
  ): Promise<{ emailUpdateToken: string; expiresIn: string }> {
    const { token: emailUpdateToken, expiresIn } = await this.sign(
      userId,
      TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
    );
    return {
      emailUpdateToken,
      expiresIn,
    };
  }

  async isTokenValid(token: string, type: TOKEN_TYPE_ENUM): Promise<boolean> {
    const { secret } = this.config.getJWTConfigByType(type);
    try {
      const { id } = await this.jwt.verifyAsync(token, {
        secret,
        algorithms: ['HS256'],
      });
      switch (type) {
        case TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION:
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

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';

@Injectable()
export class JwtConfigHandler {
  constructor(private readonly configService: ConfigService) {}

  getJwtConfigByType(tokenType: TOKEN_TYPE_ENUM): {
    secret: string;
    expiresIn: string;
  } {
    switch (tokenType) {
      case TOKEN_TYPE_ENUM.ACCESS:
        return {
          secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'ACCESS_TOKEN_EXPIRES_IN',
          ),
        };

      case TOKEN_TYPE_ENUM.REFRESH:
        return {
          secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>(
            'REFRESH_TOKEN_EXPIRES_IN',
          ),
        };

      case TOKEN_TYPE_ENUM.RESET_PASSWORD:
        return {
          secret: this.configService.getOrThrow<string>(
            'RESET_PASSWORD_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'RESET_PASSWORD_TOKEN_EXPIRES_IN',
          ),
        };

      case TOKEN_TYPE_ENUM.ACCOUNT_CONFIRMATION:
        return {
          secret: this.configService.getOrThrow<string>(
            'ACCOUNT_CONFIRMATION_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'ACCOUNT_CONFIRMATION_EXPIRES_IN',
          ),
        };

      case TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION:
        return {
          secret: this.configService.getOrThrow<string>(
            'EMAIL_CONFIRMATION_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN',
          ),
        };

      default:
        throw new Error('Invalid token type');
    }
  }
}

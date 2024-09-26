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
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        };

      case TOKEN_TYPE_ENUM.RESET_PASSWORD:
        return {
          secret: this.configService.get<string>('RESET_PASSWORD_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'RESET_PASSWORD_TOKEN_EXPIRES_IN',
          ),
        };

      case TOKEN_TYPE_ENUM.SIGN_UP:
        return {
          secret: this.configService.get<string>(
            'EMAIL_CONFIRMATION_TOKEN_SECRET',
          ),
          expiresIn: this.configService.get<string>(
            'EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN',
          ),
        };

      default:
        throw new Error('Invalid token type');
    }
  }
}

import { BackOfficeSession } from '@shared/entities/users/backoffice-session';
import * as crypto from 'crypto';
import { ApiConfigService } from '../config/app-config.service';
import { Inject } from '@nestjs/common';

export class BackofficeService {
  constructor(
    @Inject(ApiConfigService)
    private readonly configService: ApiConfigService,
  ) {}

  public generateCookieFromBackofficeSession(
    backofficeSession: BackOfficeSession,
  ): string {
    const cookieSecret = this.configService.get(
      'BACKOFFICE_SESSION_COOKIE_SECRET',
    );
    const hmac = crypto
      .createHmac('sha256', cookieSecret)
      .update(backofficeSession.sid)
      .digest('base64')
      .replace(/=+$/, '');
    return `s:${backofficeSession.sid}.${hmac}`;
  }
}

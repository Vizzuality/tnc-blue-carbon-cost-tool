import { BackOfficeSession } from '@shared/entities/users/backoffice-session';
import * as crypto from 'crypto';
import { ApiConfigService } from '../config/app-config.service';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class BackofficeService {
  constructor(
    @Inject(ApiConfigService)
    private readonly configService: ApiConfigService,
    @InjectRepository(BackOfficeSession)
    private readonly backofficeSessionRepository: Repository<BackOfficeSession>,
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

  public async getBackofficeSessionFromCookie(
    cookie: string,
  ): Promise<BackOfficeSession | null> {
    const cookieSecret = this.configService.get(
      'BACKOFFICE_SESSION_COOKIE_SECRET',
    );
    const [sid, hmac] = cookie.slice(2).split('.');
    const expectedHmac = crypto
      .createHmac('sha256', cookieSecret)
      .update(sid)
      .digest('base64')
      .replace(/=+$/, '');
    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return await this.backofficeSessionRepository.findOneBy({ sid });
    }
    return null;
  }
}

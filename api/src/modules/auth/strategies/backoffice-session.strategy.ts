import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { BackofficeService } from '@api/modules/backoffice/backoffice.service';
import { User } from '@shared/entities/users/user.entity';

@Injectable()
export class BackofficeSessionStrategy extends PassportStrategy(
  Strategy,
  'backoffice-session',
) {
  constructor(
    private readonly backofficeService: BackofficeService,
    private readonly config: ApiConfigService,
  ) {
    super();
  }

  async validate(req: Request) {
    const user = await this.getUserFromRequest(req);
    if (!user) throw new UnauthorizedException();

    return user;
  }

  private async getUserFromRequest(req: Request): Promise<User | null> {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return null;
    }

    const cookies = decodeURIComponent(cookieHeader)
      .split(';') // Split cookies by semicolon
      .map((cookie) => cookie.trim()) // Trim whitespace around each cookie
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('='); // Split key-value pairs
        acc[key] = value; // Add to the parsed cookies object
        return acc;
      }, {});

    const backofficeCookie =
      cookies[this.config.get('BACKOFFICE_SESSION_COOKIE_NAME')];
    if (!backofficeCookie) {
      return null;
    }

    const backOfficeSession =
      await this.backofficeService.getBackofficeSessionFromCookie(
        backofficeCookie,
      );
    if (!backOfficeSession) {
      return null;
    }

    return backOfficeSession.sess.adminUser;
  }
}

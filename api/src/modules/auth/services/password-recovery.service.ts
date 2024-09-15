import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';

@Injectable()
export class PasswordRecoveryService {
  logger: Logger = new Logger(PasswordRecoveryService.name);
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly authMailer: AuthMailer,
  ) {}

  async recoverPassword(email: string, origin: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      this.logger.warn(
        `Email ${email} not found when trying to recover password`,
      );
      return;
    }
    const token = this.jwt.sign({ id: user.id });
    await this.authMailer.sendPasswordRecoveryEmail({
      email: user.email,
      token,
      origin,
    });
  }
}

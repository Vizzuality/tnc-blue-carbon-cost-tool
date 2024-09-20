import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { EventBus } from '@nestjs/cqrs';
import { PasswordRecoveryRequestedEvent } from '@api/modules/events/user-events/password-recovery-requested.event';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { User } from '@shared/entities/users/user.entity';

@Injectable()
export class PasswordRecoveryService {
  logger: Logger = new Logger(PasswordRecoveryService.name);
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly authMailer: AuthMailer,
    private readonly eventBus: EventBus,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async requestPasswordRecovery(email: string, origin: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      this.logger.warn(
        `Email ${email} not found when trying to recover password`,
      );
      this.eventBus.publish(new PasswordRecoveryRequestedEvent(email, null));
      return;
    }
    const { secret, expiresIn } = this.apiConfig.getJWTConfigByType(
      TOKEN_TYPE_ENUM.RESET_PASSWORD,
    );
    const token = this.jwt.sign({ id: user.id }, { secret, expiresIn });
    await this.authMailer.sendPasswordRecoveryEmail({
      email: user.email,
      token,
      origin,
    });
    this.eventBus.publish(new PasswordRecoveryRequestedEvent(email, user.id));
  }

  async resetPassword(user: User): Promise<void> {
    throw new NotImplementedException();
  }
}

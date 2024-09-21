import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { EventBus } from '@nestjs/cqrs';
import { PasswordRecoveryRequestedEvent } from '@api/modules/events/user-events/password-recovery-requested.event';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { User } from '@shared/entities/users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordRecoveryService {
  logger: Logger = new Logger(PasswordRecoveryService.name);
  constructor(
    private readonly users: UsersService,
    private readonly authMailer: AuthMailer,
    private readonly eventBus: EventBus,
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
    await this.authMailer.sendPasswordRecoveryEmail({
      user,
      origin,
    });
    this.eventBus.publish(new PasswordRecoveryRequestedEvent(email, user.id));
  }

  async resetPassword(user: User, newPassword: string): Promise<void> {
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await this.users.updatePassword(user, newHashedPassword);
  }
}

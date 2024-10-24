import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { RequestPasswordRecoveryCommand } from '@api/modules/auth/commands/request-password-recovery.command';
import { UsersService } from '@api/modules/users/users.service';
import { NotFoundException } from '@nestjs/common';
import { PasswordRecoveryRequestedEvent } from '@api/modules/auth/events/password-recovery-requested.event';

@CommandHandler(RequestPasswordRecoveryCommand)
export class RequestPasswordRecoveryCommandHandler
  implements ICommandHandler<RequestPasswordRecoveryCommand>
{
  constructor(
    private readonly users: UsersService,
    private readonly authMailer: AuthMailer,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RequestPasswordRecoveryCommand): Promise<void> {
    const { email, origin } = command;
    const user = await this.users.findByEmail(email);
    if (!user) {
      this.eventBus.publish(new PasswordRecoveryRequestedEvent(email, null));
      throw new NotFoundException(`Email ${email} not found`);
    }
    await this.authMailer.sendPasswordRecoveryEmail({
      user,
      origin,
    });
    this.eventBus.publish(new PasswordRecoveryRequestedEvent(email, user.id));
  }
}

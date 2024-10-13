import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { SendWelcomeEmailCommand } from '@api/modules/notifications/email/commands/send-welcome-email.command';

@CommandHandler(SendWelcomeEmailCommand)
export class SendWelcomeEmailHandler
  implements ICommandHandler<SendWelcomeEmailCommand>
{
  constructor(private readonly authMailer: AuthMailer) {}

  async execute(command: SendWelcomeEmailCommand): Promise<void> {
    const { user, plainPassword, origin } = command;
    await this.authMailer.sendWelcomeEmail({
      user,
      oneTimePassword: plainPassword,
      origin,
    });
  }
}

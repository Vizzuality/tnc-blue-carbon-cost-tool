import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailConfirmationEmailCommand } from '@api/modules/notifications/email/commands/send-email-confirmation-email.command';

@CommandHandler(SendEmailConfirmationEmailCommand)
export class SendWelcomeEmailHandler
  implements ICommandHandler<SendEmailConfirmationEmailCommand>
{
  constructor(private readonly authMailer: AuthMailer) {}

  async execute(command: SendEmailConfirmationEmailCommand): Promise<void> {
    const { user, newEmail, origin } = command;
    await this.authMailer.sendEmailConfirmationEmail({
      user,
      newEmail,
      origin,
    });
  }
}

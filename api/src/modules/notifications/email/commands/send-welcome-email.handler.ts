// send-welcome-email.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendWelcomeEmailCommand } from './send-welcome-email.command';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';

@CommandHandler(SendWelcomeEmailCommand)
export class SendWelcomeEmailHandler
  implements ICommandHandler<SendWelcomeEmailCommand>
{
  constructor(private readonly authMailer: AuthMailer) {}

  async execute(command: SendWelcomeEmailCommand): Promise<void> {
    const { user, plainPassword } = command;
    await this.authMailer.sendWelcomeEmail({
      user,
      defaultPassword: plainPassword,
    });
  }
}

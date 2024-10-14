import { forwardRef, Module } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { AuthModule } from '@api/modules/auth/auth.module';
import { EmailFailedEventHandler } from '@api/modules/notifications/email/events/handlers/emai-failed-event.handler';
import { SendWelcomeEmailHandler } from '@api/modules/notifications/email/commands/handlers/send-welcome-email.handler';
import { SendEmailConfirmationHandler } from '@api/modules/notifications/email/commands/handlers/send-email-confirmation.handler';
import { EmailProviderFactory } from '@api/modules/notifications/email/email.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    EmailProviderFactory,
    SendEmailConfirmationHandler,
    SendWelcomeEmailHandler,
    EmailFailedEventHandler,
  ],
  exports: [IEmailServiceToken],
})
export class EmailModule {}

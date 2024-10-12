import { forwardRef, Module } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { NodemailerEmailService } from '@api/modules/notifications/email/nodemailer.email.service';
import { SendWelcomeEmailHandler } from '@api/modules/notifications/email/commands/send-welcome-email.handler';
import { AuthModule } from '@api/modules/auth/auth.module';
import { EmailFailedEventHandler } from '@api/modules/notifications/email/events/handlers/emai-failed-event.handler';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [
    { provide: IEmailServiceToken, useClass: NodemailerEmailService },
    SendWelcomeEmailHandler,
    EmailFailedEventHandler,
  ],
  exports: [IEmailServiceToken],
})
export class EmailModule {}

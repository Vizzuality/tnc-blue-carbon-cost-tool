import { forwardRef, Module } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { NodemailerEmailService } from '@api/modules/notifications/email/nodemailer.email.service';
import { AuthModule } from '@api/modules/auth/auth.module';
import { EmailFailedEventHandler } from '@api/modules/notifications/email/events/handlers/emai-failed-event.handler';
import { SendWelcomeEmailHandler } from '@api/modules/notifications/email/commands/handlers/send-welcome-email.handler';

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

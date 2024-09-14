import { Module } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { NodemailerEmailService } from '@api/modules/notifications/email/nodemailer.email.service';

@Module({
  providers: [
    { provide: IEmailServiceToken, useClass: NodemailerEmailService },
  ],
  exports: [IEmailServiceToken],
})
export class EmailModule {}

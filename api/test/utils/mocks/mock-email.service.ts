import { IEmailServiceInterface } from '@api/modules/notifications/email/email-service.interface';
import { Logger } from '@nestjs/common';

export class MockEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(MockEmailService.name);

  sendMail = jest.fn(async (): Promise<void> => {
    this.logger.log('Mock Email sent');
    return Promise.resolve();
  });
}

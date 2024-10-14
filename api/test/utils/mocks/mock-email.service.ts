import {
  IEmailServiceInterface,
  SendMailDTO,
} from '@api/modules/notifications/email/email-service.interface';
import { Logger } from '@nestjs/common';

export class MockEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(MockEmailService.name);

  sendMail =
    typeof jest !== 'undefined'
      ? jest.fn(async (sendMailDTO: SendMailDTO): Promise<void> => {
          this.logger.log('Mock Email sent', this.constructor.name);
          return Promise.resolve();
        })
      : async (sendMailDTO: SendMailDTO): Promise<void> => {
          this.logger.log('Mock Email sent', this.constructor.name);
          return Promise.resolve();
        };
}

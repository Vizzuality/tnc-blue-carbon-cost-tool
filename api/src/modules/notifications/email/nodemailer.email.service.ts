import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import {
  IEmailServiceInterface,
  SendMailDTO,
} from '@api/modules/notifications/email/email-service.interface';
import { EventBus } from '@nestjs/cqrs';
import { EmailFailedEvent } from '@api/modules/notifications/email/events/email-failed.event';
import { ApiConfigService } from '@api/modules/config/app-config.service';

@Injectable()
export class NodemailerEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly domain: string;

  constructor(
    private readonly eventBus: EventBus,
    private readonly apiConfig: ApiConfigService,
  ) {
    const { accessKeyId, secretAccessKey, region, domain } =
      this.apiConfig.getEmailConfig();
    const ses = new aws.SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.transporter = nodemailer.createTransport({ SES: { ses, aws } });
    this.domain = domain;
  }

  async sendMail(sendMailDTO: SendMailDTO): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `${sendMailDTO.from}@${this.domain}`,
        to: sendMailDTO.to,
        subject: sendMailDTO.subject,
        html: sendMailDTO.html,
        text: sendMailDTO.text,
      });
    } catch (e) {
      this.logger.error(`Error sending email: ${JSON.stringify(e)}`);
      this.eventBus.publish(new EmailFailedEvent(sendMailDTO.to, e.message));
      throw new ServiceUnavailableException('Could not send email');
    }
  }
}

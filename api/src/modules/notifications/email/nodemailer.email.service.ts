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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerEmailService implements IEmailServiceInterface {
  logger: Logger = new Logger(NodemailerEmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly domain: string;

  constructor(private readonly configService: ConfigService) {
    const { accessKeyId, secretAccessKey, region, domain } =
      this.getMailConfig();
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
      throw new ServiceUnavailableException('Could not send email');
    }
  }

  private getMailConfig() {
    const accessKeyId = this.configService.get<string>('AWS_SES_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SES_SECRET_ACCESS_KEY',
    );
    const region = this.configService.get<string>('AWS_SES_REGION');
    const domain = this.configService.get<string>('AWS_SES_DOMAIN');
    console.log(accessKeyId, secretAccessKey, region, domain);
    if (!accessKeyId || !secretAccessKey || !region || !domain) {
      this.logger.error(
        'Variables for Email Service not set. Email not available',
      );
    }
    return { accessKeyId, secretAccessKey, region, domain };
  }
}

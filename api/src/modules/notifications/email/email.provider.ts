import { FactoryProvider } from '@nestjs/common';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { MockEmailService } from '../../../../test/utils/mocks/mock-email.service';
import { NodemailerEmailService } from '@api/modules/notifications/email/nodemailer.email.service';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { EventBus } from '@nestjs/cqrs';

export const EmailProviderFactory: FactoryProvider = {
  provide: IEmailServiceToken,
  useFactory: (configService: ApiConfigService, eventBus: EventBus) => {
    const env = configService.get('NODE_ENV');
    return env === 'test'
      ? new MockEmailService()
      : new NodemailerEmailService(eventBus, configService);
  },
  inject: [ApiConfigService],
};

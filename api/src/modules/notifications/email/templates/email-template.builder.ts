import { WELCOME_EMAIL_HTML_CONTENT } from '@api/modules/notifications/email/templates/welcome-email.template';
import { RESET_PASSWORD_HTML_CONTENT } from '@api/modules/notifications/email/templates/reset-password.template';
import { EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT } from '@api/modules/notifications/email/templates/email-update-confirmation.template';

export enum TEMPLATE_TYPE {
  WELCOME = 'welcome',
  PASSWORD_RECOVERY = 'password-recovery',
  EMAIL_UPDATE_CONFIRMATION = 'email-update-confirmation',
}

export interface TemplateConfig {
  url: string;
  expiresIn: string;
  type: TEMPLATE_TYPE;
}

export class EmailTemplateBuilder {
  private readonly url: string;
  private readonly expiration: string;
  private readonly type: TEMPLATE_TYPE;
  private templateMap: Record<TEMPLATE_TYPE, any> = {
    [TEMPLATE_TYPE.WELCOME]: WELCOME_EMAIL_HTML_CONTENT,
    [TEMPLATE_TYPE.PASSWORD_RECOVERY]: RESET_PASSWORD_HTML_CONTENT,
    [TEMPLATE_TYPE.EMAIL_UPDATE_CONFIRMATION]:
      EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT,
  };
  constructor(contentConfig: TemplateConfig) {
    this.url = contentConfig.url;
    this.expiration = this.passwordRecoveryTokenExpirationHumanReadable(
      contentConfig.expiresIn,
    );
    this.type = contentConfig.type;
  }

  build() {
    const template = this.templateMap[this.type];
    return template(this.url, this.expiration);
  }

  private passwordRecoveryTokenExpirationHumanReadable(expirationIn: string) {
    const unit = expirationIn.slice(-1);
    const value = parseInt(expirationIn.slice(0, -1), 10);

    switch (unit) {
      case 'h':
        return `${value} hour${value > 1 ? 's' : ''}`;
      case 'd':
        return `${value} day${value > 1 ? 's' : ''}`;
      default:
        return expirationIn;
    }
  }
}
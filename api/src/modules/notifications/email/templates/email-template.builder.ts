import { WELCOME_EMAIL_HTML_CONTENT } from '@api/modules/notifications/email/templates/welcome-email.template';
import { RESET_PASSWORD_HTML_CONTENT } from '@api/modules/notifications/email/templates/reset-password.template';
import { EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT } from '@api/modules/notifications/email/templates/email-update-confirmation.template';

export enum TEMPLATE_TYPE {
  WELCOME = 'welcome',
  RESET_PASSWORD = 'reset-password',
  EMAIL_UPDATE_CONFIRMATION = 'email-update-confirmation',
}

export interface TemplateConfig {
  url: string;
  expiration: number;
  type: TEMPLATE_TYPE;
}

export class EmailTemplateBuilder {
  url: string;
  expiration: number;
  type: TEMPLATE_TYPE;
  templateMap = {
    WELCOME_EMAIL_HTML_CONTENT: WELCOME_EMAIL_HTML_CONTENT,
    RESET_PASSWORD_HTML_CONTENT: RESET_PASSWORD_HTML_CONTENT,
    EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT:
      EMAIL_UPDATE_CONFIRMATION_HTML_CONTENT,
  };
  constructor(contentConfig: TemplateConfig) {
    this.url = contentConfig.url;
    this.expiration = contentConfig.expiration;
    this.type = contentConfig.type;
  }

  build() {
    const template = this.templateMap[this.type];
    return template(this.url, this.expiration);
  }
}

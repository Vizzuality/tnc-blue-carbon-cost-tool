import { Inject, Injectable } from '@nestjs/common';
import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/notifications/email/email-service.interface';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';

export type PasswordRecovery = {
  email: string;
  token: string;
  origin: string;
};

@Injectable()
export class AuthMailer {
  constructor(
    @Inject(IEmailServiceToken)
    private readonly emailService: IEmailServiceInterface,
    private readonly apiConfig: ApiConfigService,
  ) {}

  async sendPasswordRecoveryEmail(
    passwordRecovery: PasswordRecovery,
  ): Promise<void> {
    // TODO: Investigate if it's worth using a template engine to generate the email content, the mail service provider allows it
    // TODO: Use a different expiration time, or different secret altogether for password recovery

    const { expiresIn } = this.apiConfig.getJWTConfigByType(
      TOKEN_TYPE_ENUM.RESET_PASSWORD,
    );

    const resetPasswordUrl = `${passwordRecovery.origin}/auth/forgot-password/${passwordRecovery.token}`;

    const htmlContent: string = `
    <h1>Dear User,</h1>
    <br/>
    <p>We recently received a request to reset your password for your account. If you made this request, please click on the link below to securely change your password:</p>
    <br/>
    <p><a href="${resetPasswordUrl}" target="_blank" rel="noopener noreferrer">Secure Password Reset Link</a></p>
    <br/>
    <p>This link will direct you to our app to create a new password. For security reasons, this link will expire after ${passwordRecoveryTokenExpirationHumanReadable(expiresIn)}.</p>
    <p>If you did not request a password reset, please ignore this email; your password will remain the same.</p>
    <br/>
    <p>Thank you for using the platform. We're committed to ensuring your account's security.</p>
    <p>Best regards.</p>`;

    await this.emailService.sendMail({
      from: 'password-recovery',
      to: passwordRecovery.email,
      subject: 'Recover Password',
      html: htmlContent,
    });
  }
}

const passwordRecoveryTokenExpirationHumanReadable = (
  expiration: string,
): string => {
  const unit = expiration.slice(-1);
  const value = parseInt(expiration.slice(0, -1), 10);

  switch (unit) {
    case 'h':
      return `${value} hour${value > 1 ? 's' : ''}`;
    case 'd':
      return `${value} day${value > 1 ? 's' : ''}`;
    default:
      return expiration;
  }
};

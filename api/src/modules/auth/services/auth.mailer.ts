import { Inject, Injectable } from '@nestjs/common';
import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/notifications/email/email-service.interface';
import { User } from '@shared/entities/users/user.entity';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';

export type PasswordRecoveryDto = {
  user: User;
  origin: string;
};

@Injectable()
export class AuthMailer {
  constructor(
    @Inject(IEmailServiceToken)
    private readonly emailService: IEmailServiceInterface,
    private readonly jwt: JwtManager,
  ) {}

  async sendPasswordRecoveryEmail(
    passwordRecovery: PasswordRecoveryDto,
  ): Promise<void> {
    const { resetPasswordToken, expiresIn } =
      await this.jwt.signResetPasswordToken(passwordRecovery.user.id);
    const resetPasswordUrl = `${passwordRecovery.origin}/auth/forgot-password/${resetPasswordToken}`;

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
      to: passwordRecovery.user.email,
      subject: 'Recover Password',
      html: htmlContent,
    });
  }

  async sendWelcomeEmail(welcomeEmailDto: {
    user: User;
    defaultPassword: string;
  }) {
    const { emailConfirmationToken, expiresIn } =
      await this.jwt.signEmailConfirmationToken(welcomeEmailDto.user.id);

    // TODO: We need to know the URL to confirm the email, we could rely on origin but we would need to pass it through a lot of code.
    //       probably better to have a config value for this.
    const resetPasswordUrl = `TODO/auth/sign-up/${emailConfirmationToken}`;

    const htmlContent: string = `
    <h1>Dear User,</h1>
    <br/>
    <p>Welcome to the TNC Blue Carbon Cost Tool Platform</p>
    <br/>
    <p>Thank you for signing up. We're excited to have you on board. Please active you account by signing up adding a password of your choice</p>
    <p><a href="${resetPasswordUrl}" target="_blank" rel="noopener noreferrer">Sign Up Link</a></p>
    <br/>
    <p>Your one-time password is ${welcomeEmailDto.defaultPassword}</p>
    <p>For security reasons, this link will expire after ${passwordRecoveryTokenExpirationHumanReadable(expiresIn)}.</p>
    <br/>
    <p>Thank you for using the platform. We're committed to ensuring your account's security.</p>
    <p>Best regards.</p>`;

    await this.emailService.sendMail({
      from: 'welcome',
      to: welcomeEmailDto.user.email,
      subject: 'Welcome to TNC Blue Carbon Cost Tool Platform',
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

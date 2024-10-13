import { Inject, Injectable } from '@nestjs/common';
import {
  IEmailServiceInterface,
  IEmailServiceToken,
} from '@api/modules/notifications/email/email-service.interface';
import { User } from '@shared/entities/users/user.entity';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import {
  EmailTemplateBuilder,
  TEMPLATE_TYPE,
} from '@api/modules/notifications/email/templates/email-template.builder';

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

    const templateBuilder = new EmailTemplateBuilder({
      url: resetPasswordUrl,
      expiresIn,
      type: TEMPLATE_TYPE.PASSWORD_RECOVERY,
    });

    await this.emailService.sendMail({
      from: 'password-recovery',
      to: passwordRecovery.user.email,
      subject: 'Recover Password',
      html: templateBuilder.build(),
    });
  }

  async sendWelcomeEmail(welcomeEmailDto: {
    user: User;
    oneTimePassword: string;
    origin: string;
  }) {
    const { signUpToken, expiresIn } = await this.jwt.signSignUpToken(
      welcomeEmailDto.user.id,
    );

    const resetPasswordUrl = `${welcomeEmailDto.origin}/auth/sign-up/${signUpToken}`;

    const templateBuilder = new EmailTemplateBuilder({
      url: resetPasswordUrl,
      expiresIn,
      type: TEMPLATE_TYPE.WELCOME,
    });

    await this.emailService.sendMail({
      from: 'welcome',
      to: welcomeEmailDto.user.email,
      subject: 'Welcome to TNC Blue Carbon Cost Tool Platform',
      html: templateBuilder.build(),
    });
  }

  async sendEmailConfirmationEmail(emailConfirmationDto: {
    user: User;
    newEmail: string;
    origin: string;
  }) {
    const { emailUpdateToken, expiresIn } = await this.jwt.signEmailUpdateToken(
      emailConfirmationDto.user.id,
    );

    const emailConfirmationUrl = `${emailConfirmationDto.origin}/auth/confirm-email/${emailUpdateToken}?newEmail=${emailConfirmationDto.newEmail}`;

    const templateBuilder = new EmailTemplateBuilder({
      url: emailConfirmationUrl,
      expiresIn,
      type: TEMPLATE_TYPE.EMAIL_UPDATE_CONFIRMATION,
    });

    await this.emailService.sendMail({
      from: 'email-confirmation',
      to: emailConfirmationDto.newEmail,
      subject: 'Confirm Email',
      html: templateBuilder.build(),
    });
  }
}

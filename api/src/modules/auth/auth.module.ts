import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@api/modules/auth/authentication/authentication.module';
import { AuthorisationModule } from '@api/modules/auth/authorisation/authorisation.module';
import { PasswordRecoveryService } from '@api/modules/auth/services/password-recovery.service';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';
import { AuthenticationController } from '@api/modules/auth/authentication/authentication.controller';

@Module({
  imports: [AuthenticationModule, AuthorisationModule, NotificationsModule],
  controllers: [AuthenticationController],
  providers: [PasswordRecoveryService, AuthMailer],
})
export class AuthModule {}

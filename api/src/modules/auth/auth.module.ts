import { Module } from '@nestjs/common';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';
import { AuthenticationController } from '@api/modules/auth/authentication.controller';
import { AuthenticationModule } from '@api/modules/auth/authentication.module';
import { RequestPasswordRecoveryHandler } from '@api/modules/auth/commands/request-password-recovery.handler';

@Module({
  imports: [AuthenticationModule, NotificationsModule],
  controllers: [AuthenticationController],
  providers: [AuthMailer, RequestPasswordRecoveryHandler],
  exports: [AuthenticationModule, AuthMailer],
})
export class AuthModule {}

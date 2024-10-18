import { Module } from '@nestjs/common';
import { AuthMailer } from '@api/modules/auth/services/auth.mailer';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';
import { AuthenticationController } from '@api/modules/auth/authentication.controller';
import { AuthenticationModule } from '@api/modules/auth/authentication.module';
import { RequestPasswordRecoveryCommandHandler } from '@api/modules/auth/commands/request-password-recovery-command.handler';
import { NewUserEventHandler } from '@api/modules/admin/events/handlers/new-user-event.handler';
import { PasswordRecoveryRequestedEventHandler } from '@api/modules/auth/events/handlers/password-recovery-requested.handler';

@Module({
  imports: [AuthenticationModule, NotificationsModule],
  controllers: [AuthenticationController],
  providers: [
    AuthMailer,
    RequestPasswordRecoveryCommandHandler,
    NewUserEventHandler,
    PasswordRecoveryRequestedEventHandler,
  ],
  exports: [AuthenticationModule, AuthMailer],
})
export class AuthModule {}

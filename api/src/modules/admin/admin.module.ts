import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from '@api/modules/auth/auth.module';
import { ImportModule } from '@api/modules/import/import.module';
import { NewUserEventHandler } from '@api/modules/admin/events/handlers/new-user-event.handler';
import { PasswordRecoveryRequestedEventHandler } from '@api/modules/admin/events/handlers/password-recovery-requested.handler';

@Module({
  imports: [AuthModule, ImportModule],
  providers: [NewUserEventHandler, PasswordRecoveryRequestedEventHandler],
  controllers: [AdminController],
})
export class AdminModule {}

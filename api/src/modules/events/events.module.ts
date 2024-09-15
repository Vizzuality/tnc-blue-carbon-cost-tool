import { Global, Module } from '@nestjs/common';
import { ApiEventsModule } from './api-events/api-events.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSignedUpEventHandler } from '@api/modules/events/user-events/handlers/user-signed-up.handler';
import { PasswordRecoveryRequestedEventHandler } from '@api/modules/events/user-events/handlers/password-recovery-requested.handler';
import { EmailFailedEventHandler } from '@api/modules/events/api-events/handlers/emai-failed-event.handler';

@Global()
@Module({
  imports: [CqrsModule, ApiEventsModule],
  providers: [
    UserSignedUpEventHandler,
    PasswordRecoveryRequestedEventHandler,
    EmailFailedEventHandler,
  ],
  exports: [CqrsModule],
})
export class EventsModule {}

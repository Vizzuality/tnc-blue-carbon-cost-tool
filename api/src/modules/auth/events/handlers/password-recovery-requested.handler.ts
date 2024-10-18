import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordRecoveryRequestedEvent } from '../password-recovery-requested.event';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

@EventsHandler(PasswordRecoveryRequestedEvent)
export class PasswordRecoveryRequestedEventHandler
  implements IEventHandler<PasswordRecoveryRequestedEvent>
{
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: PasswordRecoveryRequestedEvent): Promise<void> {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.USER_PASSWORD_RECOVERY_REQUESTED,
      resourceId: event.userId,
      payload: {
        email: event.email,
        warning: event.userId
          ? null
          : `Email ${event.email} not found when trying to recover password`,
      },
    });
  }
}

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '../user-signed-up.event';
import { ApiEventsService } from '@api/modules/events/api-events/api-events.service';
import { API_EVENT_TYPES } from '@api/modules/events/events.enum';

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler
  implements IEventHandler<UserSignedUpEvent>
{
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.USER_SIGNED_UP,
      resourceId: event.userId,
      payload: {
        email: event.email,
      },
    });
  }
}

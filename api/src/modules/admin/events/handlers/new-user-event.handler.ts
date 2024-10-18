import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { NewUserEvent } from '../new-user.event';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

@EventsHandler(NewUserEvent)
export class NewUserEventHandler implements IEventHandler<NewUserEvent> {
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: NewUserEvent): Promise<void> {
    const { userId, email, type: eventType } = event;
    if (eventType === API_EVENT_TYPES.USER_CREATED) {
      await this.registerUserCreatedEvent(userId, { email });
    }
    if (eventType === API_EVENT_TYPES.USER_SIGNED_UP) {
      await this.registerUserSignedUpEvent(userId, { email });
    }
  }

  private async registerUserCreatedEvent(
    userId: string,
    payload: { email: string },
  ) {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.USER_CREATED,
      resourceId: userId,
      payload,
    });
    this.apiEventsService.logger.warn(
      `New user added to the system with email: ${payload.email}`,
    );
  }

  private async registerUserSignedUpEvent(
    userId: string,
    payload: { email: string },
  ) {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.USER_SIGNED_UP,
      resourceId: userId,
      payload,
    });
    this.apiEventsService.logger.warn(
      `New user signed up to the system with email: ${payload.email}`,
    );
  }
}

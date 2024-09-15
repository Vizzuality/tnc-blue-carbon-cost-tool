import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailFailedEvent } from '../email-failed.event';
import { API_EVENT_TYPES } from '@api/modules/events/events.enum';
import { ApiEventsService } from '@api/modules/events/api-events/api-events.service';

@EventsHandler(EmailFailedEvent)
export class EmailFailedEventHandler
  implements IEventHandler<EmailFailedEvent>
{
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: EmailFailedEvent): Promise<void> {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.EMAIL_FAILED,
      resourceId: null,
      payload: {
        email: event.email,
        errorMessage: event.errorMessage,
      },
    });
  }
}

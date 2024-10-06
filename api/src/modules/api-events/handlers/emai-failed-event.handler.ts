import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailFailedEvent } from '../email-failed.event';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

@EventsHandler(EmailFailedEvent)
export class EmailFailedEventHandler
  implements IEventHandler<EmailFailedEvent>
{
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: EmailFailedEvent): Promise<void> {
    const { email, errorMessage } = event;
    await this.registerEmailFailedEvent({ email, errorMessage });
  }

  private async registerEmailFailedEvent(payload: {
    email: string;
    errorMessage: string;
  }) {
    await this.apiEventsService.create({
      eventType: API_EVENT_TYPES.EMAIL_FAILED,
      resourceId: null,
      payload,
    });
  }
}

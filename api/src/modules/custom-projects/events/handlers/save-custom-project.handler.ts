import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';
import { SaveCustomProjectEvent } from '@api/modules/custom-projects/events/save-custom-project.event';

@EventsHandler(SaveCustomProjectEvent)
export class SaveCustomProjectEventHandler
  implements IEventHandler<SaveCustomProjectEvent>
{
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: SaveCustomProjectEvent): Promise<void> {
    const eventType = event.success
      ? API_EVENT_TYPES.CUSTOM_PROJECT_SAVED
      : API_EVENT_TYPES.ERROR_SAVING_CUSTOM_PROJECT;
    await this.apiEventsService.create({
      eventType,
      resourceId: event.userId,
      payload: event.payload,
    });
  }
}

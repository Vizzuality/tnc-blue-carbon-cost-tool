import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { ImportEvent } from '@api/modules/import/events/import.event';

@EventsHandler(ImportEvent)
export class ImportEventHandler implements IEventHandler<ImportEvent> {
  constructor(private readonly apiEventsService: ApiEventsService) {}

  async handle(event: ImportEvent): Promise<void> {
    await this.apiEventsService.create({
      eventType: event.kind,
      resourceId: event.userId,
      payload: event.payload,
    });
  }
}

import { Module } from '@nestjs/common';
import { ApiEventsModule } from './api-events/api-events.module';

@Module({
  imports: [ApiEventsModule],
})
export class EventsModule {}

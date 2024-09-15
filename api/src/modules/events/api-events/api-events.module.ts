import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiEventsEntity } from '@api/modules/events/api-events/api-events.entity';
import { ApiEventsService } from '@api/modules/events/api-events/api-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiEventsEntity])],
  providers: [ApiEventsService],
  exports: [ApiEventsService],
})
export class ApiEventsModule {}

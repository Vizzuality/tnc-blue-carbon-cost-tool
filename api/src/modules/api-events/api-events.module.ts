import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';
import { ApiEventsEntity } from '@api/modules/api-events/api-events.entity';

@Global()
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ApiEventsEntity])],
  providers: [ApiEventsService],
  exports: [CqrsModule, ApiEventsService],
})
export class ApiEventsModule {}

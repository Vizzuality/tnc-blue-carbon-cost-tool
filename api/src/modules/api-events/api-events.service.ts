import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiEventsEntity } from './api-events.entity';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

type CreateApiEvent = {
  eventType: API_EVENT_TYPES;
  resourceId?: string;
  payload?: any;
};

@Injectable()
export class ApiEventsService {
  constructor(
    @InjectRepository(ApiEventsEntity)
    private readonly apiEventsRepository: Repository<ApiEventsEntity>,
  ) {}

  async create(createEventDto: CreateApiEvent): Promise<void> {
    await this.apiEventsRepository.insert(createEventDto);
  }
}

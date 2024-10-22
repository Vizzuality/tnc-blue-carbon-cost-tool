import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';

@Entity('api_events')
export class ApiEventsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: API_EVENT_TYPES,
    name: 'event_type',
    enumName: 'api_event_types',
  })
  eventType: API_EVENT_TYPES;

  @Column({ type: 'uuid', nullable: true, name: 'resource_id' })
  resourceId: string | null;

  @Column('jsonb')
  payload: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

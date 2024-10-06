import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ACTIVITY, ECOSYSTEM } from '@api/modules/model/base-data.entity';
import { Country } from '@api/modules/model/entities/country.entity';

export enum CARBON_INPUT_TYPE {
  ECOSYSTEM_EXTENT = 'ecosystem_extent',
  ECOSYSTEM_LOSS = 'ecoystem_loss',
  RESTORABLE_LAND = 'restorable_land',
}

@Index('idx_carbon_input_country_activity_ecosystem', [
  'countryCode',
  'activity',
  'ecosystem',
])
@Entity('carbon_input')
export class CarbonInputEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ecosystem', enum: ECOSYSTEM, type: 'enum' })
  ecosystem: ECOSYSTEM;

  @Column({ name: 'activity', enum: ACTIVITY, type: 'enum' })
  activity: ACTIVITY;

  @Column({ name: 'country_code', length: 3, nullable: true })
  countryCode: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_code' })
  country: Country;

  // TODO: Probably this column shoudl not be editable
  @Column({ type: 'enum', enum: CARBON_INPUT_TYPE })
  type: CARBON_INPUT_TYPE;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;
}

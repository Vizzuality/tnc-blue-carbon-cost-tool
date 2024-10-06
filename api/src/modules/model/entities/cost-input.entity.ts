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

export enum COST_INPUT_TYPE {
  PROJECT_SIZE_HA = 'project_size_ha',
  FEASIBILITY_ANALYSIS = 'feasibility_analysis',
  CONSERVATION_PLANNING_AND_ADMIN = 'conservation_planning_and_admin',
}

@Index('idx_country_activity_ecosystem', [
  'countryCode',
  'activity',
  'ecosystem',
])
@Entity('cost_input')
export class CostInput {
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

  @Column({ type: 'enum', enum: COST_INPUT_TYPE })
  type: COST_INPUT_TYPE;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;
}

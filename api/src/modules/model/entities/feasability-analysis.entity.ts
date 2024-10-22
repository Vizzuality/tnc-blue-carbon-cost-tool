import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { BaseData } from '@shared/entities/base-data.entity';

@Entity('feasibility_analysis')
export class FeasibilityAnalysis extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { name: 'analysis_score' })
  analysisScore: number;

  @OneToMany(() => BaseData, (baseData) => baseData.feasibilityAnalysis)
  baseData: BaseData[];
}

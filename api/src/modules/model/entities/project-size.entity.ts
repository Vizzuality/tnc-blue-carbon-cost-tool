import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { BaseData } from '@shared/entities/base-data.entity';

@Entity('project_size')
export class ProjectSize extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { name: 'size_ha' })
  sizeHa: number;

  @OneToMany(() => BaseData, (baseData) => baseData.projectSize)
  baseData: BaseData[];

  //TODO: Additionally include unit for each type?
}

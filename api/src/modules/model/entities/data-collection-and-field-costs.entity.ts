import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { BaseData } from '@api/modules/model/base-data.entity';

@Entity('data_collection_and_field_costs')
export class DataCollectionAndFieldCosts extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { name: 'field_cost' })
  fieldCost: number;

  @OneToMany(() => BaseData, (baseData) => baseData.dataCollectionAndFieldCosts)
  baseData: BaseData[];
}

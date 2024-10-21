import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseData } from '@api/modules/model/base-data.entity';

@Entity('project_size')
export class ProjectSize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { name: 'size_ha' })
  sizeHa: number;

  @OneToMany(() => BaseData, (baseData) => baseData.projectSize)
  baseData: BaseData[];

  //TODO: Additionally include unit for each type?
}

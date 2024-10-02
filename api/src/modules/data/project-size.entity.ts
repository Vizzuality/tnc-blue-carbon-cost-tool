// project-size.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '@shared/entities/countries/country.entity';

@Entity({ name: 'project_size' })
export class ProjectSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  country_code: string;

  // Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_code' })
  country: Country;

  @Column('numeric')
  mangrove_restored_area: number;

  @Column('numeric')
  seagrass_restored_area: number;

  @Column('numeric')
  salt_marsh_restored_area: number;

  @Column('numeric')
  mangrove_conserved_area: number;

  @Column('numeric')
  seagrass_conserved_area: number;

  @Column('numeric')
  salt_marsh_conserved_area: number;
}
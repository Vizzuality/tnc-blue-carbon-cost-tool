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

  @Column({ length: 3, unique: true })
  country_code: string;

  // Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_code' })
  country: Country;

  @Column('numeric', { nullable: true })
  mangrove_restored_area: number;

  @Column('numeric', { nullable: true })
  seagrass_restored_area: number;

  @Column('numeric', { nullable: true })
  salt_marsh_restored_area: number;

  @Column('numeric', { nullable: true })
  mangrove_conserved_area: number;

  @Column('numeric', { nullable: true })
  seagrass_conserved_area: number;

  @Column('numeric', { nullable: true })
  salt_marsh_conserved_area: number;
}

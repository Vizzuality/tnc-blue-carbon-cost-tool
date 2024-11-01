import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";

@Entity("maintenance")
@Unique(["country"])
export class Maintenance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "maintenance_cost_pc_of_impl_labor_cost" })
  maintenanceCost: number;

  @Column("decimal", { name: "maintenance_duration_years" })
  maintenanceDuration: number;
}

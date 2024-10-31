import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";

@Entity("maintenance_2")
@Unique(["country"])
export class Maintenance2 extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "maintenance_cost_pc_of_impl_labor_cost" })
  maintenanceCost: number;

  @Column("decimal", { name: "maintenance_duration_years" })
  maintenanceDuration: number;
}

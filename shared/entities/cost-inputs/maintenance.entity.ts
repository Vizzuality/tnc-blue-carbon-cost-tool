import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

@Entity("maintenance")
@Unique(["country"])
export class Maintenance extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column("decimal", { name: "maintenance_cost_pc_of_impl_labor_cost" })
  maintenanceCost: number;

  @Column("decimal", { name: "maintenance_duration_years" })
  maintenanceDuration: number;
}

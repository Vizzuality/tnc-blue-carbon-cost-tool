import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";

@Entity("financing_cost")
@Unique(["country"])
export class FinancingCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "financing_cost_capex_percent" })
  financingCostCapexPercent: number;
}

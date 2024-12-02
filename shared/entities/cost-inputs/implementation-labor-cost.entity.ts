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
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

@Entity("implementation_labor_cost")
@Unique(["country", "ecosystem"])
export class ImplementationLaborCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "planting_cost_ha" })
  plantingCost: number;

  @Column("decimal", { name: "hybrid_cost_ha" })
  hybridCost: number;

  @Column("decimal", { name: "hydrology_cost_ha" })
  hydrologyCost: number;
}

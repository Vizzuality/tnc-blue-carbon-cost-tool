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

@Entity("carbon_standard_fees")
@Unique(["country"])
export class CarbonStandardFees extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column("decimal", { name: "cost_per_carbon_credit_issued" })
  carbonStandardFee: number;
}

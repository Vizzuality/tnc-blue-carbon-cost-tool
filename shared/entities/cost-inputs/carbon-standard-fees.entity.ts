import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";

@Entity("carbon_standard_fees_2")
@Unique(["country"])
export class CarbonStandardFees2 extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "cost_per_carbon_credit_issued" })
  carbonStandardFee: number;
}

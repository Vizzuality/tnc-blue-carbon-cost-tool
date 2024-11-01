import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";

@Entity("validation_cost")
@Unique(["country"])
export class ValidationCost extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "validation_cost" })
  validationCost: number;
}

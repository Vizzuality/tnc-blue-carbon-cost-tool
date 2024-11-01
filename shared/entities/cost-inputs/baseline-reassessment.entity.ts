import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";

@Entity("baseline_reassessment")
@Unique(["country"])
export class BaselineReassessment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "baseline_reassessment_cost_per_event" })
  baselineReassessmentCost: number;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
} from "typeorm";
import { Country } from "../country.entity";

@Entity("baseline_reassessment_2")
@Unique(["country"])
export class BaselineReassessment2 extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column("decimal", { name: "baseline_reassessment_cost_per_event" })
  baselineReassessmentCost: number;
}

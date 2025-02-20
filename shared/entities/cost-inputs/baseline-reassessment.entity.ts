import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";

@Entity("baseline_reassessment")
@Unique(["country"])
export class BaselineReassessment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column("decimal", { name: "baseline_reassessment_cost_per_event" })
  baselineReassessmentCost: number;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  @ManyToOne("ModelComponentSource", "baselineReassessment", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}

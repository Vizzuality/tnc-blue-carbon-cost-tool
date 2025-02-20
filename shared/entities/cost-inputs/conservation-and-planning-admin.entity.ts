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
import { ModelComponentSource } from "@shared/entities/methodology/model-component-source.entity";
import { ACTIVITY } from "@shared/entities/activity.enum";

@Entity("conservation_planning_and_admin")
@Unique(["country", "ecosystem", "activity"])
export class ConservationPlanningAndAdmin extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

  @Column("decimal", { name: "planning_cost_per_project" })
  planningCost: number;

  @Column({ name: "source_id", type: "int4", nullable: true })
  @ManyToOne("ModelComponentSource", "conservationPlanningAndAdmin", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}

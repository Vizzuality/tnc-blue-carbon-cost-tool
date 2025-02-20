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

@Entity("long_term_project_operating")
@Unique(["country", "ecosystem"])
export class LongTermProjectOperating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "country_code", type: "char", length: 3 })
  countryCode: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "long_term_project_operating_cost_per_year" })
  longTermProjectOperatingCost: number;

  @Column({ name: "source_id", type: "int4", nullable: true })
  @ManyToOne("ModelComponentSource", "longTermProjectOperating", {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "source_id" })
  source: ModelComponentSource;
}

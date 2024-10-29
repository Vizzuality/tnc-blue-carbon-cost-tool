import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Unique,
} from "typeorm";
import { Country } from "../country.entity";
import { ECOSYSTEM } from "../ecosystem.enum";

@Entity("long_term_project_operating")
@Unique(["country", "ecosystem"])
export class LongTermProjectOperating extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "long_term_project_operating_cost_per_year" })
  longTermProjectOperatingCost: number;
}

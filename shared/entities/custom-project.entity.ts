import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { Country } from "@shared/entities/country.entity";
import { User } from "@shared/entities/users/user.entity";
import { type CustomProjectOutput } from "@shared/dtos/custom-projects/custom-project-output.dto";

/**
 * @note: This entity does not extend BaseEntity as it won't be used in the backoffice. However, it has to be added to the BO datasource due to its relation
 *        to other entities that  (i.e User)
 */

export enum CARBON_REVENUES_TO_COVER {
  OPEX = "Opex",
  CAPEX_AND_OPEX = "Capex and Opex",
}

export enum PROJECT_SPECIFIC_EMISSION {
  ONE_EMISSION_FACTOR = "One emission factor",
  TWO_EMISSION_FACTORS = "Two emission factors",
}
export enum PROJECT_EMISSION_FACTORS {
  TIER_1 = "Tier 1 - Global emission factor",
  TIER_2 = "Tier 2 - Country-specific emission factor",
  TIER_3 = "Tier 3 - Project specific emission factor",
}

@Entity({ name: "custom_projects" })
export class CustomProject {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ name: "project_name", type: "varchar" })
  projectName: string;

  @Column({ name: "total_cost_npv", type: "decimal", nullable: true })
  totalCostNPV: number;

  @Column({ name: "total_cost", type: "decimal", nullable: true })
  totalCost: number;

  @Column({ name: "breakeven_total_cost_npv", type: "decimal", nullable: true })
  breakevenTotalCostNPV: number;

  @Column({ name: "breakeven_total_cost", type: "decimal", nullable: true })
  breakevenTotalCost: number;

  @Column({ name: "project_size", type: "decimal" })
  projectSize: number;

  @Column({ name: "project_length", type: "decimal" })
  projectLength: number;

  @Column({ name: "abatement_potential", type: "decimal", nullable: true })
  abatementPotential?: number;

  @ManyToOne(() => User, (user) => user.customProjects, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToOne(() => Country, (country) => country.code, { onDelete: "CASCADE" })
  @JoinColumn({ name: "country_code" })
  country: Country;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

  @Column({ name: "input_snapshot", type: "jsonb" })
  // TODO: this should be the infered type of the zod schema
  input: any;

  @Column({ name: "output_snapshot", type: "jsonb" })
  output: CustomProjectOutput;
}

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
 * @description: This entity is to save Custom Projects (that are calculated, and can be saved only by registered users. Most likely, we don't need to add these as a resource
 * in the backoffice because privacy reasons.
 *
 * The shape defined here is probably wrong, it's only based on the output of the prototype in the notebooks, and it will only serve as a learning resource.
 */

@Entity({ name: "custom_projects" })
export class CustomProject {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ name: "project_name" })
  projectName: string;

  @Column({ name: "total_cost_npv", type: "decimal", nullable: true })
  totalCostNPV: number;

  @Column({ name: "total_cost", type: "decimal", nullable: true })
  totalCost: number;

  @Column({ name: "project_size", type: "decimal" })
  projectSize: number;

  @Column({ name: "project_length", type: "decimal" })
  projectLength: number;

  @Column({ name: "abatement_potential", type: "decimal", nullable: true })
  abatementPotential: number;

  @ManyToOne(() => User, (user) => user.customProjects, { onDelete: "CASCADE" })
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

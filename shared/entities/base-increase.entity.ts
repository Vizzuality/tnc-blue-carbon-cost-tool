import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";

@Entity("base_increase")
export class BaseIncrease extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column("decimal", { name: "feasibility_analysis" })
  feasibilityAnalysis: number;

  @Column("decimal", { name: "conservation_planning_and_admin" })
  conservationPlanningAndAdmin: number;

  @Column("decimal", { name: "data_collection_and_field_cost" })
  dataCollectionAndFieldCost: number;

  @Column("decimal", { name: "community_representation" })
  communityRepresentation: number;

  @Column("decimal", { name: "blue_carbon_project_planning" })
  blueCarbonProjectPlanning: number;

  @Column("decimal", { name: "establishing_carbon_rights" })
  establishingCarbonRights: number;

  @Column("decimal", { name: "financing_cost" })
  financingCost: number;

  @Column("decimal", { name: "validation" })
  validation: number;

  @Column("decimal", { name: "monitoring" })
  monitoring: number;

  @Column("decimal", { name: "baseline_reassessment" })
  baselineReassessment: number;

  @Column("decimal", { name: "mrv" })
  mrv: number;

  @Column("decimal", { name: "long_term_project_operating_cost" })
  longTermProjectOperatingCost: number;
}

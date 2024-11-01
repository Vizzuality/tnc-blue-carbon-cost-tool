import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";

@Entity("base_size")
export class BaseSize extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

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

  @Column("decimal", { name: "implementation_labor_planting" })
  implementationLaborPlanting: number;

  @Column("decimal", { name: "implementation_labor_hybrid" })
  implementationLaborHybrid: number;

  @Column("decimal", { name: "implementation_labor_hydrology" })
  implementationLaborHydrology: number;

  @Column("decimal", { name: "monitoring" })
  monitoring: number;

  @Column("decimal", { name: "baseline_reassessment" })
  baselineReassessment: number;

  @Column("decimal", { name: "mrv" })
  mrv: number;

  @Column("decimal", { name: "long_term_project_operating_cost" })
  longTermProjectOperatingCost: number;
}

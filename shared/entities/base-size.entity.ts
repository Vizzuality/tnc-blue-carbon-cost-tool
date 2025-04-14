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

  @Column({ name: "feasibility_analysis", type: "double precision" })
  feasibilityAnalysis: number;

  @Column( { name: "conservation_planning_and_admin", type: "double precision" })
  conservationPlanningAndAdmin: number;

  @Column( { name: "data_collection_and_field_cost", type: "double precision" })
  dataCollectionAndFieldCost: number;

  @Column( { name: "community_representation", type: "double precision" })
  communityRepresentation: number;

  @Column({ name: "blue_carbon_project_planning", type: "double precision" })
  blueCarbonProjectPlanning: number;

  @Column( { name: "establishing_carbon_rights", type: "double precision" })
  establishingCarbonRights: number;

  @Column( { name: "financing_cost", type: "double precision" })
  financingCost: number;

  @Column( { name: "validation", type: "double precision" })
  validation: number;

  @Column( { name: "implementation_labor_planting", type: "double precision" })
  implementationLaborPlanting: number;

  @Column( { name: "implementation_labor_hybrid", type: "double precision" })
  implementationLaborHybrid: number;

  @Column( { name: "implementation_labor_hydrology", type: "double precision" })
  implementationLaborHydrology: number;

  @Column( { name: "monitoring", type: "double precision" })
  monitoring: number;

  @Column( { name: "baseline_reassessment", type: "double precision" })
  baselineReassessment: number;

  @Column( { name: "mrv", type: "double precision" })
  mrv: number;

  @Column( { name: "long_term_project_operating_cost",type: "double precision" })
  longTermProjectOperatingCost: number;
}

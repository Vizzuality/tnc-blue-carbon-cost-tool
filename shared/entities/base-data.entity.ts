import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ProjectSize } from "@shared/entities/project-size.entity";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity";

export enum ECOSYSTEM {
  MANGROVE = "Mangrove",
  SEAGRASS = "Seagrass",
  SALT_MARSH = "Salt marsh",
}

export enum ACTIVITY {
  RESTORATION = "Restoration",
  CONSERVATION = "Conservation",
}

@Entity("base_data")
export class BaseData extends BaseEntity {
  // TODO: We could use a integer value as primary to match the excel rows so that we know if there are new values or something is being updated
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "ecosystem", enum: ECOSYSTEM, type: "enum" })
  ecosystem: ECOSYSTEM;

  @Column({ name: "activity", enum: ACTIVITY, type: "enum" })
  activity: ACTIVITY;

  @Column({ name: "country_code", length: 3, nullable: true, type: "char" })
  countryCode: string;

  // Unidirectional relation
  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_code" })
  country: Country;

  // Using a string reference to avoid AdminJS crashing when no metadata for this entity is found through BaseData
  @ManyToOne("ProjectSize", (projectSize: ProjectSize) => projectSize.baseData)
  @JoinColumn({ name: "project_size", referencedColumnName: "id" })
  projectSize: ProjectSize;

  @ManyToOne(
    "FeasibilityAnalysis",
    (feasibilityAnalysis: FeasibilityAnalysis) => feasibilityAnalysis.baseData,
  )
  @JoinColumn({ name: "feasibility_analysis", referencedColumnName: "id" })
  feasibilityAnalysis: FeasibilityAnalysis;

  @ManyToOne(
    "ConservationPlanningAndAdmin",
    (conservationPlanningAndAdmin: ConservationPlanningAndAdmin) =>
      conservationPlanningAndAdmin.baseData,
  )
  @JoinColumn({
    name: "conservation_planning_and_admin",
    referencedColumnName: "id",
  })
  conservationPlanningAndAdmin: ConservationPlanningAndAdmin;

  @ManyToOne(
    "DataCollectionAndFieldCosts",
    (dataCollectionAndFieldCosts: DataCollectionAndFieldCosts) =>
      dataCollectionAndFieldCosts.baseData,
  )
  @JoinColumn({
    name: "data_collection_and_field_costs",
    referencedColumnName: "id",
  })
  dataCollectionAndFieldCosts: DataCollectionAndFieldCosts;
}

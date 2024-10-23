import { CommunityCashFlow } from "./community-cash-flow.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Country } from "@shared/entities/country.entity";
import { ProjectSize } from "@shared/entities/project-size.entity";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity";
import { CommunityRepresentation } from "./community-representation.entity";
import { CarbonRights } from "./establishing-carbon-rights.entity";
import { FinancingCost } from "./financing-cost.entity";
import { ValidationCost } from "./validation.entity";
import { ImplementationLaborCost } from "./implementation-labor.entity";
import { MonitoringCost } from "./monitoring.entity";
import { Maintenance } from "./maintenance.entity";
import { CommunityBenefitSharingFund } from "./community-benefit-sharing-fund.entity";
import { CarbonStandardFees } from "./carbon-standard-fees.entity";
import { EcosystemLoss } from "./ecosystem-loss.entity";
import { RestorableLand } from "./restorable-land.entity";

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
  @OneToOne("ProjectSize", (projectSize: ProjectSize) => projectSize.baseData)
  @JoinColumn({ name: "project_size", referencedColumnName: "id" })
  projectSize: ProjectSize;

  @OneToOne(
    "FeasibilityAnalysis",
    (feasibilityAnalysis: FeasibilityAnalysis) => feasibilityAnalysis.baseData
  )
  @JoinColumn({ name: "feasibility_analysis", referencedColumnName: "id" })
  feasibilityAnalysis: FeasibilityAnalysis;

  @OneToOne(
    "ConservationPlanningAndAdmin",
    (conservationPlanningAndAdmin: ConservationPlanningAndAdmin) =>
      conservationPlanningAndAdmin.baseData
  )
  @JoinColumn({
    name: "conservation_planning_and_admin",
    referencedColumnName: "id",
  })
  conservationPlanningAndAdmin: ConservationPlanningAndAdmin;

  @OneToOne(
    "CommunityRepresentation",
    (communityRepresentation: CommunityRepresentation) =>
      communityRepresentation.baseData
  )
  @JoinColumn({
    name: "community_representation",
    referencedColumnName: "id",
  })
  communityRepresentation: CommunityRepresentation;

  @OneToOne(
    "CarbonRights",
    (carbonRights: CarbonRights) => carbonRights.baseData
  )
  @JoinColumn({
    name: "carbon_rights",
    referencedColumnName: "id",
  })
  carbonRights: CarbonRights;

  @OneToOne(
    "FinancingCost",
    (financingCost: FinancingCost) => financingCost.baseData
  )
  @JoinColumn({
    name: "financing_cost",
    referencedColumnName: "id",
  })
  financingCost: FinancingCost;

  @OneToOne(
    "ValidationCost",
    (validationCost: ValidationCost) => validationCost.baseData
  )
  @JoinColumn({
    name: "validation_cost",
    referencedColumnName: "id",
  })
  validationCost: ValidationCost;

  @OneToOne(
    "ImplementationLaborCost",
    (implementationLaborCost: ImplementationLaborCost) =>
      implementationLaborCost.baseData
  )
  @JoinColumn({
    name: "implementation_labor_cost",
    referencedColumnName: "id",
  })
  implementationLaborCost: ImplementationLaborCost;

  @OneToOne(
    "MonitoringCost",
    (monitoringCost: MonitoringCost) => monitoringCost.baseData
  )
  @JoinColumn({
    name: "monitoring_cost",
    referencedColumnName: "id",
  })
  monitoringCost: MonitoringCost;

  @OneToOne("Maintenance", (maintenance: Maintenance) => maintenance.baseData)
  @JoinColumn({
    name: "maintenance",
    referencedColumnName: "id",
  })
  maintenance: Maintenance;

  @OneToOne(
    "DataCollectionAndFieldCosts",
    (dataCollectionAndFieldCosts: DataCollectionAndFieldCosts) =>
      dataCollectionAndFieldCosts.baseData
  )
  @JoinColumn({
    name: "data_collection_and_field_costs",
    referencedColumnName: "id",
  })
  dataCollectionAndFieldCosts: DataCollectionAndFieldCosts;

  @OneToOne(
    "CommunityBenefitSharingFund",
    (communityBenefit: CommunityBenefitSharingFund) => communityBenefit.baseData
  )
  @JoinColumn({
    name: "community_benefit_sharing_fund",
    referencedColumnName: "id",
  })
  communityBenefit: CommunityBenefitSharingFund;

  @OneToOne(
    "CarbonStandardFees",
    (carbonStandardFees: CarbonStandardFees) => carbonStandardFees.baseData
  )
  @JoinColumn({
    name: "carbon_standard_fees",
    referencedColumnName: "id",
  })
  carbonStandardFees: CarbonStandardFees;

  @OneToOne(
    "CommunityCashFlow",
    (communityCashFlow: CommunityCashFlow) => communityCashFlow.baseData
  )
  @JoinColumn({
    name: "community_cash_flow",
    referencedColumnName: "id",
  })
  communityCashFlow: CommunityCashFlow;

  @OneToOne(
    "EcosystemLoss",
    (ecosystemLoss: EcosystemLoss) => ecosystemLoss.baseData
  )
  @JoinColumn({
    name: "ecosystem_loss",
    referencedColumnName: "id",
  })
  ecosystemLoss: EcosystemLoss;

  @OneToOne(
    "RestorableLand",
    (restorableLand: RestorableLand) => restorableLand.baseData
  )
  @JoinColumn({
    name: "restorable_land",
    referencedColumnName: "id",
  })
  restorableLand: EcosystemLoss;
}

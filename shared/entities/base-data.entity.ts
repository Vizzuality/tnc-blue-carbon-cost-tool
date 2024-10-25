import { CommunityCashFlow } from "./community-cash-flow.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToOne,
  Index,
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
import { EmissionFactors } from "./emission-factors.entity";
import { BaselineReassessment } from "./baseline-reassessment.entity";
import { MRV } from "./mrv.entity";
import { BlueCarbonProjectPlanning } from "./blue-carbon-project-planning.entity";
import { LongTermProjectOperating } from "./long-term-project-operating.entity";
import { SequestrationRate } from "./sequestration-rate.entity";

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
@Index(
  "compose_idx_countrycode_ecosystem_activity",
  ["ecosystem", "activity", "countryCode"],
  { unique: true },
)
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
  @OneToOne("ProjectSize", (projectSize: ProjectSize) => projectSize.baseData, {
    cascade: ["insert"],
  })
  @JoinColumn({ name: "project_size", referencedColumnName: "id" })
  projectSize: ProjectSize;

  @OneToOne(
    "FeasibilityAnalysis",
    (feasibilityAnalysis: FeasibilityAnalysis) => feasibilityAnalysis.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({ name: "feasibility_analysis", referencedColumnName: "id" })
  feasibilityAnalysis: FeasibilityAnalysis;

  @OneToOne(
    "ConservationPlanningAndAdmin",
    (conservationPlanningAndAdmin: ConservationPlanningAndAdmin) =>
      conservationPlanningAndAdmin.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "conservation_planning_and_admin",
    referencedColumnName: "id",
  })
  conservationPlanningAndAdmin: ConservationPlanningAndAdmin;

  @OneToOne(
    "CommunityRepresentation",
    (communityRepresentation: CommunityRepresentation) =>
      communityRepresentation.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "community_representation",
    referencedColumnName: "id",
  })
  communityRepresentation: CommunityRepresentation;

  @OneToOne(
    "CarbonRights",
    (carbonRights: CarbonRights) => carbonRights.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "carbon_rights",
    referencedColumnName: "id",
  })
  carbonRights: CarbonRights;

  @OneToOne(
    "FinancingCost",
    (financingCost: FinancingCost) => financingCost.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "financing_cost",
    referencedColumnName: "id",
  })
  financingCost: FinancingCost;

  @OneToOne(
    "ValidationCost",
    (validationCost: ValidationCost) => validationCost.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "validation_cost",
    referencedColumnName: "id",
  })
  validationCost: ValidationCost;

  @OneToOne(
    "ImplementationLaborCost",
    (implementationLaborCost: ImplementationLaborCost) =>
      implementationLaborCost.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "implementation_labor_cost",
    referencedColumnName: "id",
  })
  implementationLaborCost: ImplementationLaborCost;

  @OneToOne(
    "MonitoringCost",
    (monitoringCost: MonitoringCost) => monitoringCost.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "monitoring_cost",
    referencedColumnName: "id",
  })
  monitoringCost: MonitoringCost;

  @OneToOne("Maintenance", (maintenance: Maintenance) => maintenance.baseData, {
    cascade: ["insert"],
  })
  @JoinColumn({
    name: "maintenance",
    referencedColumnName: "id",
  })
  maintenance: Maintenance;

  @OneToOne(
    "DataCollectionAndFieldCosts",
    (dataCollectionAndFieldCosts: DataCollectionAndFieldCosts) =>
      dataCollectionAndFieldCosts.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "data_collection_and_field_costs",
    referencedColumnName: "id",
  })
  dataCollectionAndFieldCosts: DataCollectionAndFieldCosts;

  @OneToOne(
    "CommunityBenefitSharingFund",
    (communityBenefit: CommunityBenefitSharingFund) =>
      communityBenefit.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "community_benefit_sharing_fund",
    referencedColumnName: "id",
  })
  communityBenefit: CommunityBenefitSharingFund;

  @OneToOne(
    "CarbonStandardFees",
    (carbonStandardFees: CarbonStandardFees) => carbonStandardFees.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "carbon_standard_fees",
    referencedColumnName: "id",
  })
  carbonStandardFees: CarbonStandardFees;

  @OneToOne(
    "CommunityCashFlow",
    (communityCashFlow: CommunityCashFlow) => communityCashFlow.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "community_cash_flow",
    referencedColumnName: "id",
  })
  communityCashFlow: CommunityCashFlow;

  @OneToOne(
    "EcosystemLoss",
    (ecosystemLoss: EcosystemLoss) => ecosystemLoss.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "ecosystem_loss",
    referencedColumnName: "id",
  })
  ecosystemLoss: EcosystemLoss;

  @OneToOne(
    "RestorableLand",
    (restorableLand: RestorableLand) => restorableLand.baseData,
    {
      cascade: ["insert"],
    },
  )
  @JoinColumn({
    name: "restorable_land",
    referencedColumnName: "id",
  })
  restorableLand: RestorableLand;

  @OneToOne(
    "EmissionFactors",
    (emissionFactors: EmissionFactors) => emissionFactors.baseData,
  )
  @JoinColumn({
    name: "emission_factors",
    referencedColumnName: "id",
  })
  emissionFactors: EmissionFactors;

  @OneToOne(
    "BaselineReassessment",
    (baselineReassessment: BaselineReassessment) =>
      baselineReassessment.baseData,
  )
  @JoinColumn({
    name: "baseline_reassessment",
    referencedColumnName: "id",
  })
  baselineReassessment: BaselineReassessment;

  @OneToOne("MRV", (mrv: MRV) => mrv.baseData)
  @JoinColumn({
    name: "mrv",
    referencedColumnName: "id",
  })
  mrv: MRV;

  @OneToOne(
    "BlueCarbonProjectPlanning",
    (blueCarbonProjectPlanning: BlueCarbonProjectPlanning) =>
      blueCarbonProjectPlanning.baseData,
  )
  @JoinColumn({
    name: "blue_carbon_project_planning",
    referencedColumnName: "id",
  })
  blueCarbonProjectPlanning: BlueCarbonProjectPlanning;

  @OneToOne(
    "LongTermProjectOperating",
    (longTermProjectOperating: LongTermProjectOperating) =>
      longTermProjectOperating.baseData,
  )
  @JoinColumn({
    name: "long_term_project_operating",
    referencedColumnName: "id",
  })
  longTermProjectOperating: LongTermProjectOperating;

  @OneToOne(
    "SequestrationRate",
    (sequestrationRate: SequestrationRate) => sequestrationRate.baseData,
  )
  @JoinColumn({
    name: "sequestration_rate",
    referencedColumnName: "id",
  })
  sequestrationRate: SequestrationRate;
}

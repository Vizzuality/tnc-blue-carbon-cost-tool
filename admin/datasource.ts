import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { Project } from "@shared/entities/projects.entity.js";
import { ProjectSize2 } from "@shared/entities/cost-inputs/project-size.entity.js";
import { FeasibilityAnalysis2 } from "@shared/entities/cost-inputs/feasability-analysis.entity.js";
import { ConservationPlanningAndAdmin2 } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity.js";
import { DataCollectionAndFieldCosts2 } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity.js";
import { CarbonStandardFees2 } from "@shared/entities/cost-inputs/carbon-standard-fees.entity.js";
import { CommunityBenefitSharingFund2 } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity.js";
import { CommunityCashFlow2 } from "@shared/entities/cost-inputs/community-cash-flow.entity.js";
import { CommunityRepresentation2 } from "@shared/entities/cost-inputs/community-representation.entity.js";
import { EcosystemLoss2 } from "@shared/entities/carbon-inputs/ecosystem-loss.entity.js";
import { CarbonRights2 } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity.js";
import { FinancingCost2 } from "@shared/entities/cost-inputs/financing-cost.entity.js";
import { Maintenance2 } from "@shared/entities/cost-inputs/maintenance.entity.js";
import { MonitoringCost2 } from "@shared/entities/cost-inputs/monitoring.entity.js";
import { RestorableLand2 } from "@shared/entities/carbon-inputs/restorable-land.entity.js";
import { ValidationCost2 } from "@shared/entities/cost-inputs/validation.entity.js";
import { BaselineReassessment2 } from "@shared/entities/cost-inputs/baseline-reassessment.entity.js";
import { BlueCarbonProjectPlanning2 } from "@shared/entities/cost-inputs/blue-carbon-project-planning.entity.js";
import { EmissionFactors2 } from "@shared/entities/carbon-inputs/emission-factors.entity.js";
import { LongTermProjectOperating2 } from "@shared/entities/cost-inputs/long-term-project-operating.entity.js";
import { MRV2 } from "@shared/entities/cost-inputs/mrv.entity.js";
import { SequestrationRate2 } from "@shared/entities/carbon-inputs/sequestration-rate.entity.js";
import { EcosystemExtent2 } from "@shared/entities/carbon-inputs/ecosystem-extent.entity.js";
import { BaseDataView } from "@shared/entities/base-data.view.js";

// TODO: If we import the COMMON_DATABASE_ENTITIES from shared, we get an error where DataSouce is not set for a given entity
export const ADMINJS_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  ProjectSize2,
  FeasibilityAnalysis2,
  ConservationPlanningAndAdmin2,
  DataCollectionAndFieldCosts2,
  CarbonStandardFees2,
  CommunityBenefitSharingFund2,
  CommunityCashFlow2,
  CommunityRepresentation2,
  EcosystemLoss2,
  CarbonRights2,
  FinancingCost2,
  Maintenance2,
  MonitoringCost2,
  RestorableLand2,
  ValidationCost2,
  BaselineReassessment2,
  BlueCarbonProjectPlanning2,
  EmissionFactors2,
  LongTermProjectOperating2,
  MRV2,
  SequestrationRate2,
  Project,
  EcosystemExtent2,
  BaseDataView,
];

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME || "blue-carbon-cost",
  password: process.env.DB_PASSWORD || "blue-carbon-cost",
  database: process.env.DB_NAME || "blc-dev",
  // TODO: Use common db entities from shared
  entities: ADMINJS_ENTITIES,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

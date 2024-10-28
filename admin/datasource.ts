import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { ProjectSize } from "@shared/entities/project-size.entity.js";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity.js";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity.js";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity.js";
import { CarbonStandardFees } from "@shared/entities/carbon-standard-fees.entity.js";
import { CommunityBenefitSharingFund } from "@shared/entities/community-benefit-sharing-fund.entity.js";
import { CommunityCashFlow } from "@shared/entities/community-cash-flow.entity.js";
import { CommunityRepresentation } from "@shared/entities/community-representation.entity.js";
import { EcosystemLoss } from "@shared/entities/ecosystem-loss.entity.js";
import { CarbonRights } from "@shared/entities/establishing-carbon-rights.entity.js";
import { FinancingCost } from "@shared/entities/financing-cost.entity.js";
import { ImplementationLaborCost } from "@shared/entities/implementation-labor.entity.js";
import { Maintenance } from "@shared/entities/maintenance.entity.js";
import { MonitoringCost } from "@shared/entities/monitoring.entity.js";
import { RestorableLand } from "@shared/entities/restorable-land.entity.js";
import { ValidationCost } from "@shared/entities/validation.entity.js";
import { BaselineReassessment } from "@shared/entities/baseline-reassessment.entity.js";
import { BlueCarbonProjectPlanning } from "@shared/entities/blue-carbon-project-planning.entity.js";
import { EmissionFactors } from "@shared/entities/emission-factors.entity.js";
import { LongTermProjectOperating } from "@shared/entities/long-term-project-operating.entity.js";
import { MRV } from "@shared/entities/mrv.entity.js";
import { SequestrationRate } from "@shared/entities/sequestration-rate.entity.js";
import { Project } from "@shared/entities/projects.entity.js";

// TODO: If we import the COMMON_DATABASE_ENTITIES from shared, we get an error where DataSouce is not set for a given entity
export const ADMINJS_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  ProjectSize,
  FeasibilityAnalysis,
  ConservationPlanningAndAdmin,
  DataCollectionAndFieldCosts,
  CarbonStandardFees,
  CommunityBenefitSharingFund,
  CommunityCashFlow,
  CommunityRepresentation,
  EcosystemLoss,
  CarbonRights,
  FinancingCost,
  ImplementationLaborCost,
  Maintenance,
  MonitoringCost,
  RestorableLand,
  ValidationCost,
  BaselineReassessment,
  BlueCarbonProjectPlanning,
  EmissionFactors,
  LongTermProjectOperating,
  MRV,
  SequestrationRate,
  Project,
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

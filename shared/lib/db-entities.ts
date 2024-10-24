import { User } from "@shared/entities/users/user.entity";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";
import { Country } from "@shared/entities/country.entity";
import { BaseData } from "@shared/entities/base-data.entity";
import { ProjectSize } from "@shared/entities/project-size.entity";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity";
import { CarbonStandardFees } from "@shared/entities/carbon-standard-fees.entity";
import { CommunityBenefitSharingFund } from "@shared/entities/community-benefit-sharing-fund.entity";
import { CommunityCashFlow } from "@shared/entities/community-cash-flow.entity";
import { CommunityRepresentation } from "@shared/entities/community-representation.entity";
import { EcosystemLoss } from "@shared/entities/ecosystem-loss.entity";
import { CarbonRights } from "@shared/entities/establishing-carbon-rights.entity";
import { FinancingCost } from "@shared/entities/financing-cost.entity";
import { ImplementationLaborCost } from "@shared/entities/implementation-labor.entity";
import { Maintenance } from "@shared/entities/maintenance.entity";
import { MonitoringCost } from "@shared/entities/monitoring.entity";
import { RestorableLand } from "@shared/entities/restorable-land.entity";
import { ValidationCost } from "@shared/entities/validation.entity";
import { BaselineReassessment } from "@shared/entities/baseline-reassessment.entity";
import { BlueCarbonProjectPlanning } from "@shared/entities/blue-carbon-project-planning.entity";
import { EmissionFactors } from "@shared/entities/emission-factors.entity";
import { LongTermProjectOperating } from "@shared/entities/long-term-project-operating.entity";
import { MRV } from "@shared/entities/mrv.entity";
import { SequestrationRate } from "@shared/entities/sequestration-rate.entity";

export const COMMON_DATABASE_ENTITIES = [
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
  ConservationPlanningAndAdmin,
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
];

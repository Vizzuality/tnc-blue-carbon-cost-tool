import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";
import { BaseDataView } from "@shared/entities/base-data.view";
import { EcosystemExtent2 } from "@shared/entities/carbon-inputs/ecosystem-extent.entity";
import { EcosystemLoss2 } from "@shared/entities/carbon-inputs/ecosystem-loss.entity";
import { EmissionFactors2 } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { RestorableLand2 } from "@shared/entities/carbon-inputs/restorable-land.entity";
import { SequestrationRate2 } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { BaselineReassessment2 } from "@shared/entities/cost-inputs/baseline-reassessment.entity";
import { BlueCarbonProjectPlanning2 } from "@shared/entities/cost-inputs/blue-carbon-project-planning.entity";
import { CarbonStandardFees2 } from "@shared/entities/cost-inputs/carbon-standard-fees.entity";
import { CommunityBenefitSharingFund2 } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity";
import { CommunityCashFlow2 } from "@shared/entities/cost-inputs/community-cash-flow.entity";
import { CommunityRepresentation2 } from "@shared/entities/cost-inputs/community-representation.entity";
import { ConservationPlanningAndAdmin2 } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts2 } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity";
import { CarbonRights2 } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity";
import { FeasibilityAnalysis2 } from "@shared/entities/cost-inputs/feasability-analysis.entity";
import { FinancingCost2 } from "@shared/entities/cost-inputs/financing-cost.entity";
import { LongTermProjectOperating2 } from "@shared/entities/cost-inputs/long-term-project-operating.entity";
import { Maintenance2 } from "@shared/entities/cost-inputs/maintenance.entity";
import { MonitoringCost2 } from "@shared/entities/cost-inputs/monitoring.entity";
import { MRV2 } from "@shared/entities/cost-inputs/mrv.entity";
import { ProjectSize2 } from "@shared/entities/cost-inputs/project-size.entity";
import { ValidationCost2 } from "@shared/entities/cost-inputs/validation.entity";
import { Country } from "@shared/entities/country.entity";
import { Project } from "@shared/entities/projects.entity";
import { User } from "@shared/entities/users/user.entity";

export const COMMON_DATABASE_ENTITIES = [
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

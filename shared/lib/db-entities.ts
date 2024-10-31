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
import { Project } from "@shared/entities/projects.entity";
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
import { EcosystemExtent2 } from "@shared/entities/carbon-inputs/ecosystem-extent.entity";
import { BaseDataView } from "@shared/entities/base-data.view";

export const COMMON_DATABASE_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  ProjectSize,
  ProjectSize2,
  FeasibilityAnalysis,
  FeasibilityAnalysis2,
  ConservationPlanningAndAdmin,
  ConservationPlanningAndAdmin2,
  DataCollectionAndFieldCosts,
  DataCollectionAndFieldCosts2,
  CarbonStandardFees,
  CarbonStandardFees2,
  CommunityBenefitSharingFund,
  CommunityBenefitSharingFund2,
  CommunityCashFlow,
  CommunityCashFlow2,
  CommunityRepresentation,
  CommunityRepresentation2,
  EcosystemLoss,
  EcosystemLoss2,
  CarbonRights,
  CarbonRights2,
  FinancingCost,
  FinancingCost2,
  ImplementationLaborCost,
  Maintenance,
  Maintenance2,
  MonitoringCost,
  MonitoringCost2,
  RestorableLand,
  RestorableLand2,
  ValidationCost,
  ValidationCost2,
  BaselineReassessment,
  BaselineReassessment2,
  BlueCarbonProjectPlanning,
  BlueCarbonProjectPlanning2,
  EmissionFactors,
  EmissionFactors2,
  LongTermProjectOperating,
  LongTermProjectOperating2,
  MRV,
  MRV2,
  SequestrationRate,
  SequestrationRate2,
  Project,
  EcosystemExtent2,
  BaseDataView,
];

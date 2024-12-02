import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";
import { BaseDataView } from "@shared/entities/base-data.view";
import { EcosystemExtent } from "@shared/entities/carbon-inputs/ecosystem-extent.entity";
import { EcosystemLoss } from "@shared/entities/carbon-inputs/ecosystem-loss.entity";
import { EmissionFactors } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { RestorableLand } from "@shared/entities/carbon-inputs/restorable-land.entity";
import { SequestrationRate } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { BaselineReassessment } from "@shared/entities/cost-inputs/baseline-reassessment.entity";
import { BlueCarbonProjectPlanning } from "@shared/entities/cost-inputs/blue-carbon-project-planning.entity";
import { CarbonStandardFees } from "@shared/entities/cost-inputs/carbon-standard-fees.entity";
import { CommunityBenefitSharingFund } from "@shared/entities/cost-inputs/community-benefit-sharing-fund.entity";
import { CommunityCashFlow } from "@shared/entities/cost-inputs/community-cash-flow.entity";
import { CommunityRepresentation } from "@shared/entities/cost-inputs/community-representation.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/cost-inputs/conservation-and-planning-admin.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/cost-inputs/data-collection-and-field-costs.entity";
import { CarbonRights } from "@shared/entities/cost-inputs/establishing-carbon-rights.entity";
import { FeasibilityAnalysis } from "@shared/entities/cost-inputs/feasability-analysis.entity";
import { FinancingCost } from "@shared/entities/cost-inputs/financing-cost.entity";
import { LongTermProjectOperating } from "@shared/entities/cost-inputs/long-term-project-operating.entity";
import { Maintenance } from "@shared/entities/cost-inputs/maintenance.entity";
import { MonitoringCost } from "@shared/entities/cost-inputs/monitoring.entity";
import { MRV } from "@shared/entities/cost-inputs/mrv.entity";
import { ProjectSize } from "@shared/entities/cost-inputs/project-size.entity";
import { ValidationCost } from "@shared/entities/cost-inputs/validation.entity";
import { Country } from "@shared/entities/country.entity";
import { ImplementationLaborCost } from "@shared/entities/cost-inputs/implementation-labor-cost.entity";
import { Project } from "@shared/entities/projects.entity";
import { User } from "@shared/entities/users/user.entity";
import { BaseSize } from "@shared/entities/base-size.entity";
import { BaseIncrease } from "@shared/entities/base-increase.entity";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";
import { CustomProject } from "@shared/entities/custom-project.entity";
import { UserUploadCostInputs } from "@shared/entities/users/user-upload-cost-inputs.entity";
import { UserUploadRestorationInputs } from "@shared/entities/users/user-upload-restoration-inputs.entity";
import { UserUploadConservationInputs } from "@shared/entities/users/user-upload-conservation-inputs.entity";
import { ProjectScorecard } from "@shared/entities/project-scorecard.entity";
import { ProjectScorecardView } from "@shared/entities/project-scorecard.view";

export const COMMON_DATABASE_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
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
  EcosystemExtent,
  BaseDataView,
  ImplementationLaborCost,
  BaseSize,
  BaseIncrease,
  ModelAssumptions,
  CustomProject,
  UserUploadCostInputs,
  UserUploadRestorationInputs,
  UserUploadConservationInputs,
  ProjectScorecard,
  ProjectScorecardView,
];

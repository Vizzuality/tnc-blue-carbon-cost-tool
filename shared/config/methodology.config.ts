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
import { ImplementationLaborCost } from "@shared/entities/cost-inputs/implementation-labor-cost.entity";
import { LongTermProjectOperating } from "@shared/entities/cost-inputs/long-term-project-operating.entity";
import { Maintenance } from "@shared/entities/cost-inputs/maintenance.entity";
import { MonitoringCost } from "@shared/entities/cost-inputs/monitoring.entity";
import { MRV } from "@shared/entities/cost-inputs/mrv.entity";
import { ValidationCost } from "@shared/entities/cost-inputs/validation.entity";
import { ModelAssumptions } from "@shared/entities/model-assumptions.entity";

export type MethodologySourcesConfigEntry =
  (typeof MethodologySourcesConfig)[number];

// All the relationshipts between the Entities and sources must exists before adding an entry to this configuration.
// m2m relationships just need to be configured on the back office side
export const MethodologySourcesConfig = [
  // Carbon
  {
    entity: EcosystemExtent,
    label: "Ecosystem extent",
    category: "Carbon",
    relationshipType: "m2m",
    propertiesWithSources: ["extent", "historicExtent", "unprotectedExtent"],
  },
  {
    entity: SequestrationRate,
    label: "Sequestration rate",
    category: "Carbon",
    relationshipType: "m2m",
    propertiesWithSources: ["tier1Factor", "tier2Factor"],
  },
  {
    entity: EcosystemLoss,
    label: "Loss rate",
    category: "Carbon",
    relationshipType: "1n",
  },
  {
    entity: EmissionFactors,
    label: "Emission factors",
    category: "Carbon",
    relationshipType: "m2m",
    propertiesWithSources: ["AGB", "SOC", "global"],
  },
  {
    entity: RestorableLand,
    label: "Restorable land",
    category: "Carbon",
    relationshipType: "1n",
  },
  // Costs
  {
    entity: FeasibilityAnalysis,
    label: "Feasibility analysis",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: ConservationPlanningAndAdmin,
    label: "Conservation planning",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: DataCollectionAndFieldCosts,
    label: "Data collection",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: CommunityRepresentation,
    label: "Community liaison",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: BlueCarbonProjectPlanning,
    label: "Blue carbon project planning",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: CarbonRights,
    label: "Establishing carbon rights",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: FinancingCost,
    label: "Financing costs",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: ValidationCost,
    label: "Validation costs",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: ImplementationLaborCost,
    label: "Implementation",
    category: "Costs",
    relationshipType: "m2m",
    propertiesWithSources: ["plantingCost", "hybridCost", "hydrologyCost"],
  },
  {
    entity: MonitoringCost,
    label: "Monitoring",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: Maintenance,
    label: "Maintenance",
    category: "Costs",
    relationshipType: "m2m",
    propertiesWithSources: [
      "maintenance",
      "maintenanceDuration",
      "maintenanceCost",
    ],
  },
  {
    entity: CommunityBenefitSharingFund,
    label: "Community benefit sharing",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: BaselineReassessment,
    label: "Baseline reassessment",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: MRV,
    label: "MRV",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: LongTermProjectOperating,
    label: "Long term project operating",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: CarbonStandardFees,
    label: "Carbon standard fees",
    category: "Costs",
    relationshipType: "1n",
  },
  {
    entity: CommunityCashFlow,
    label: "Community cash flow",
    category: "Costs",
    relationshipType: "1n",
  },
  // Economic factors
  {
    entity: ModelAssumptions,
    label: "Model assumptions",
    category: "Economic factors",
    relationshipType: "1n",
    omitInView: true,
  },
] as const;

import { ProjectScorecardDto } from "@shared/dtos/projects/project-scorecard.dto";

import { parseTableData } from "@/lib/utils";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

/**
 * TODO: This is a duplicate mapping, we should refactor this to be shared.
 * Starting by defining a common interface (see type CostEstimates)
 */
type CostEstimates = ProjectScorecardDto["projectCost"]["total"];

const costEstimatesLabelMap: Record<
  Exclude<
    keyof CostEstimates,
    "monitoringMaintenance" | "costPerTCO2e" | "totalRevenue"
  >,
  string
> = {
  capex: "Capital expenditure",
  feasibilityAnalysis: "Feasibility analysis",
  conservationPlanning: "Conservation planning and admin",
  dataCollection: "Data collection and field costs",
  communityRepresentation: "Community representation",
  blueCarbonProjectPlanning: "Blue carbon project planning",
  establishingCarbonRights: "Establishing carbon rights",
  validation: "Validation",
  implementationLabor: "Implementation labor",
  opex: "Operating expenditure",
  monitoring: "Monitoring",
  maintenance: "Maintenance",
  communityBenefit: "Community benefit sharing fund",
  carbonStandardFees: "Carbon standard fees",
  baselineReassessment: "Baseline reassessment",
  mrv: "MRV",
  longTermProjectOperating: "Long-term project operating",
  totalCost: "Total cost",
} as const;

function parseCostEstimatesForTable(data: CostEstimates): CostItem[] {
  return parseTableData(data, costEstimatesLabelMap);
}

export { parseCostEstimatesForTable };

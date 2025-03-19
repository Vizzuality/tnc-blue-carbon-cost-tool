import { CustomProjectCostDetails } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { ACTIVITY } from "@shared/entities/activity.enum";

import { parseTableData } from "@/lib/utils";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

const CONSERVATION_PROJECT_COST_LABELS: Record<
  Exclude<keyof CustomProjectCostDetails, "implementationLabor">,
  string
> = {
  capitalExpenditure: "Capital expenditure",
  feasibilityAnalysis: "Feasibility analysis",
  conservationPlanningAndAdmin: "Conservation planning and admin",
  dataCollectionAndFieldCost: "Data collection and field costs",
  communityRepresentation: "Community representation",
  blueCarbonProjectPlanning: "Blue carbon project planning",
  establishingCarbonRights: "Establishing carbon rights",
  validation: "Validation",
  operationalExpenditure: "Operating expenditure",
  monitoring: "Monitoring",
  maintenance: "Maintenance",
  communityBenefitSharingFund: "Landowner/community benefit share",
  carbonStandardFees: "Carbon standard fees",
  baselineReassessment: "Baseline reassessment",
  mrv: "MRV",
  longTermProjectOperatingCost: "Long-term project operating",
  totalCost: "Total cost",
} as const;

const RESTORATION_PROJECT_COST_LABELS: Record<
  keyof CustomProjectCostDetails,
  string
> = {
  ...CONSERVATION_PROJECT_COST_LABELS,
  implementationLabor: "Implementation labor",
} as const;

function parseCostDetailsForTable(
  activity: ACTIVITY,
  data?: CustomProjectCostDetails,
): CostItem[] {
  if (!data) return [];

  if (activity === ACTIVITY.CONSERVATION) {
    return parseTableData(data, CONSERVATION_PROJECT_COST_LABELS);
  }

  return parseTableData(data, RESTORATION_PROJECT_COST_LABELS);
}

export { parseCostDetailsForTable };

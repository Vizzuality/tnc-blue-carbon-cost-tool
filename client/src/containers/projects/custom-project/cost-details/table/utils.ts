import { CustomProjectCostDetails } from "@shared/dtos/custom-projects/custom-project-output.dto";

import { parseTableData } from "@/lib/utils";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

const customProjectCostDetailsLabelMap: Record<
  keyof CustomProjectCostDetails,
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
  implementationLabor: "Implementation labor",
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

function parseCostDetailsForTable(data?: CustomProjectCostDetails): CostItem[] {
  if (!data) return [];

  return parseTableData(data, customProjectCostDetailsLabelMap);
}

export { parseCostDetailsForTable };

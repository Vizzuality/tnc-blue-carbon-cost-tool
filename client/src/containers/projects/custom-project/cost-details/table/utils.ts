import { CustomProjectCostDetails } from "@shared/dtos/custom-projects/custom-project-output.dto";

import { formatCurrency } from "@/lib/format";

import { CostItem } from "@/containers/projects/custom-project/cost-details/table";

const capitalExpenditurePattern =
  /^(capitalExpenditure|feasibilityAnalysis|conservationPlanningAndAdmin|dataCollectionAndFieldCost|communityRepresentation|blueCarbonProjectPlanning|establishingCarbonRights|validation|implementationLabor)$/;
const operationalExpenditurePattern =
  /^(operationalExpenditure|monitoring|maintenance|communityBenefitSharingFund|carbonStandardFees|baselineReassessment|mrv|longTermProjectOperatingCost)$/;
const currencySettings = { maximumFractionDigits: 0 };
const customProjectCostDetailsLabelMap: Record<
  keyof CustomProjectCostDetails,
  string
> = {
  capitalExpenditure: "Capital expenditure",
  operationalExpenditure: "Operating expenditure",
  totalCost: "Total cost",
  feasibilityAnalysis: "Feasibility analysis",
  conservationPlanningAndAdmin: "Conservation planning and admin",
  dataCollectionAndFieldCost: "Data collection and field costs",
  communityRepresentation: "Community representation",
  blueCarbonProjectPlanning: "Blue carbon project planning",
  establishingCarbonRights: "Establishing carbon rights",
  validation: "Validation",
  implementationLabor: "Implementation labor",
  monitoring: "Monitoring",
  maintenance: "Maintenance",
  communityBenefitSharingFund: "Community benefit sharing fund",
  carbonStandardFees: "Carbon standard fees",
  baselineReassessment: "Baseline reassessment",
  mrv: "MRV",
  longTermProjectOperatingCost: "Long-term project operating",
} as const;

function parseCostDetailsForTable(data: CustomProjectCostDetails): CostItem[] {
  const capitalItems: CostItem[] = [];
  const operationalItems: CostItem[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key === "totalCost") {
      return;
    }

    const costItem: CostItem = {
      costName: key,
      label:
        customProjectCostDetailsLabelMap[key as keyof CustomProjectCostDetails],
      value: formatCurrency(value, currencySettings),
    };

    if (capitalExpenditurePattern.test(key)) {
      capitalItems.push(costItem);
    } else if (operationalExpenditurePattern.test(key)) {
      operationalItems.push(costItem);
    }
  });

  const totalCostItem: CostItem = {
    costName: "totalCost",
    label: "Total cost",
    value: formatCurrency(data.totalCost, currencySettings),
  };

  // Array should be in this order
  return [...capitalItems, ...operationalItems, totalCostItem];
}

export { parseCostDetailsForTable };

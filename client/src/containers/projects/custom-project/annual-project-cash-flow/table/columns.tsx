import { YearlyBreakdownCostName } from "@shared/dtos/custom-projects/custom-project-output.dto";
import { createColumnHelper } from "@tanstack/react-table";

import { formatCurrency } from "@/lib/format";

interface CostValues {
  [key: string]: number;
}

interface TableRow {
  costName: string;
  totalCost: number;
  totalNPV: number;
  costValues: CostValues;
}

const columnHelper = createColumnHelper<TableRow>();
const cashflowCostNameMap: Record<YearlyBreakdownCostName, string> = {
  financingCost: "Financing cost",
  monitoring: "Monitoring",
  maintenance: "Maintenance",
  communityBenefitSharingFund: "Community benefit sharing fund",
  carbonStandardFees: "Carbon standard fees",
  baselineReassessment: "Baseline reassessment",
  mrv: "MRV",
  longTermProjectOperatingCost: "Long-term project operating",
  feasibilityAnalysis: "Feasibility analysis",
  conservationPlanningAndAdmin: "Conservation planning and admin",
  dataCollectionAndFieldCost: "Data collection and field costs",
  communityRepresentation: "Community representation",
  blueCarbonProjectPlanning: "Blue carbon project planning",
  establishingCarbonRights: "Establishing carbon rights",
  validation: "Validation",
  implementationLabor: "Implementation labor",
  opexTotalCostPlan: "Total OpEx",
  capexTotalCostPlan: "Total CapEx",
  totalCostPlan: "Total Cost",
  estimatedRevenuePlan: "Est. revenue",
  creditsIssuedPlan: "Est. Credit issued",
  cumulativeNetIncomePlan: "Revenue OpEx",
  cumulativeNetIncomeCapexOpex: "Revenue CapEx + OpEx",
  annualNetCashFlow: "Annual net cash flow",
  annualNetIncome: "Revenue Opex",
};

export const columns = (years: number[]) => [
  columnHelper.accessor("costName", {
    header: () => <span>Project</span>,
    cell: (info) => (
      <span>
        {cashflowCostNameMap[info.getValue() as YearlyBreakdownCostName]}
      </span>
    ),
  }),
  ...years.map((year) =>
    columnHelper.accessor(`costValues.${year}`, {
      header: () => <span>{year}</span>,
      cell: (info) => (
        <span className="text-center">
          {formatCurrency(info.getValue(), { maximumFractionDigits: 0 })}
        </span>
      ),
    }),
  ),
];

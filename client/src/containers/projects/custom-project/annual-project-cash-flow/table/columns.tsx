import { OverridableCostInputs } from "@shared/dtos/custom-projects/cost.inputs";
import { createColumnHelper } from "@tanstack/react-table";

import { formatCurrency } from "@/lib/format";

import mockData from "@/containers/projects/custom-project/mock-data";

const YEARS = [
  -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

interface CostValues {
  [key: string]: number;
}

interface TableRow {
  costName: string;
  totalCost: number;
  totalNPV: number;
  costValues: CostValues;
}

const getRandomNumber = (type?: "negative" | "positive"): number => {
  if (!type)
    return Math.sign(Math.random() - 0.5) * Math.round(Math.random() * 5000000);

  if (type === "negative") return Math.round(Math.random() * -5000000);

  return Math.round(Math.random() * 5000000);
};

const columnHelper = createColumnHelper<TableRow>();
const cashflowCostNameMap: Record<keyof OverridableCostInputs, string> = {
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
};

export const chartData = YEARS.map((y) => ({
  year: y,
  estimatedRevenue: getRandomNumber("negative"),
  totalOpEx: getRandomNumber("positive"),
  annualNetCashFlow: getRandomNumber(),
  revenueOpEx: getRandomNumber(),
}));
export const tableData = mockData.data.yearlyBreakdown;

export const columns = (years: number[]) => [
  columnHelper.accessor("costName", {
    header: () => <span>Project</span>,
    cell: (info) => (
      <span>
        {cashflowCostNameMap[info.getValue() as keyof OverridableCostInputs]}
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

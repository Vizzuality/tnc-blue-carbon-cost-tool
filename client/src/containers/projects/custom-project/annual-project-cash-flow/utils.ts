import {
  CostPlanMap,
  YearlyBreakdown,
  YearlyBreakdownCostName,
} from "@shared/dtos/custom-projects/custom-project-output.dto";

function getBreakdownYears(data: YearlyBreakdown[]): number[] {
  if (data.length === 0) return [];

  return Object.keys(data[0].costValues)
    .map((y) => Number(y))
    .sort((a, b) => a - b);
}

type ChartDataKeys =
  | "estimatedRevenuePlan"
  | "opexTotalCostPlan"
  | "capexTotalCostPlan"
  | "annualNetCashFlow"
  | "cumulativeNetIncomePlan";

type ChartData = Record<ChartDataKeys, CostPlanMap>;
type YearlyBreakdownData = {
  estimatedRevenuePlan: number;
  opexTotalCostPlan: number;
  capexTotalCostPlan: number;
  annualNetCashFlow: number;
  cumulativeNetIncomePlan: number;
  year: number;
};
type YearlyBreakdownChartData = YearlyBreakdownData[];

function parseYearlyBreakdownForChart(
  data: YearlyBreakdown[],
  years: number[],
): YearlyBreakdownChartData {
  if (data.length === 0) return [];

  const chartData: ChartData = {
    estimatedRevenuePlan: {},
    opexTotalCostPlan: {},
    capexTotalCostPlan: {},
    annualNetCashFlow: {},
    cumulativeNetIncomePlan: {},
  };

  // Populate chart data based on yearly breakdown
  data.forEach(({ costName, costValues }) => {
    if (costName in chartData) {
      chartData[costName as ChartDataKeys] = costValues;
    }
  });

  // Transform data for each year
  return years.map((year) => ({
    year,
    ...Object.keys(chartData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: chartData[key as ChartDataKeys][year],
      }),
      {} as Record<ChartDataKeys, number>,
    ),
  }));
}
type CostNameConfig = {
  order: number;
  label: string;
};

const cashflowConfig: Record<YearlyBreakdownCostName, CostNameConfig> = {
  feasibilityAnalysis: {
    order: 0,
    label: "Feasibility analysis",
  },
  conservationPlanningAndAdmin: {
    order: 1,
    label: "Conservation planning and admin",
  },
  dataCollectionAndFieldCost: {
    order: 3,
    label: "Data collection and field costs",
  },
  communityRepresentation: {
    order: 4,
    label: "Community representation",
  },
  blueCarbonProjectPlanning: {
    order: 5,
    label: "Blue carbon project planning",
  },
  establishingCarbonRights: {
    order: 6,
    label: "Establishing carbon rights",
  },
  validation: {
    order: 7,
    label: "Validation",
  },
  implementationLabor: {
    order: 8,
    label: "Implementation labor",
  },
  capexTotalCostPlan: {
    order: 9,
    label: "Total CapEx",
  },
  monitoring: {
    order: 10,
    label: "Monitoring",
  },
  maintenance: {
    order: 11,
    label: "Maintenance",
  },
  communityBenefitSharingFund: {
    order: 12,
    label: "Landowner/community benefit share",
  },
  carbonStandardFees: {
    order: 13,
    label: "Carbon standard fees",
  },
  baselineReassessment: {
    order: 14,
    label: "Baseline reassessment",
  },
  mrv: {
    order: 15,
    label: "MRV",
  },
  longTermProjectOperatingCost: {
    order: 16,
    label: "Long-term project operating",
  },
  opexTotalCostPlan: {
    order: 17,
    label: "Total OpEx",
  },
  totalCostPlan: {
    order: 18,
    label: "Total Cost",
  },
  creditsIssuedPlan: {
    order: 19,
    label: "Est. credits issued",
  },
  estimatedRevenuePlan: {
    order: 20,
    label: "Est. revenue",
  },
  financingCost: {
    order: 21,
    label: "Financing cost",
  },
  cumulativeNetIncomePlan: {
    order: 22,
    label: "Revenue OpEx",
  },
  cumulativeNetIncomeCapexOpex: {
    order: 23,
    label: "Revenue CapEx + OpEx",
  },
  annualNetIncome: {
    order: 24,
    label: "Revenue Opex",
  },
  annualNetCashFlow: {
    order: 25,
    label: "Annual net cash flow",
  },
};

function parseYearlyBreakdownForTable(
  data: YearlyBreakdown[],
): YearlyBreakdown[] {
  return [...data].sort((a, b) => {
    const orderA = cashflowConfig[a.costName].order;
    const orderB = cashflowConfig[b.costName].order;
    return orderA - orderB;
  });
}

export {
  getBreakdownYears,
  parseYearlyBreakdownForChart,
  parseYearlyBreakdownForTable,
  cashflowConfig,
  type YearlyBreakdownChartData,
};

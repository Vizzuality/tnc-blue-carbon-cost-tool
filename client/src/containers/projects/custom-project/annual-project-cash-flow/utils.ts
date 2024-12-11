import {
  CostPlanMap,
  YearlyBreakdown,
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

export {
  getBreakdownYears,
  parseYearlyBreakdownForChart,
  type YearlyBreakdownChartData,
};

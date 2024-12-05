import { YearlyBreakdown } from "@shared/dtos/custom-projects/custom-project-output.dto";

function getBreakdownYears(data: YearlyBreakdown[]): string[] {
  if (data.length === 0) return [];

  return Object.keys(data[0].costValues)
    .map((y) => y)
    .sort((a, b) => Number(a) - Number(b));
}

// TODO: This functionality will be used when backend API response is updated
// function parseYearlyBreakdownForChart(
//   data: YearlyBreakdown[],
//   years: string[],
// ) {
//   if (data.length === 0) return [];

//   let estimatedRenevueValues = {};
//   let annualNetCashFlowValues = {};

//   data.forEach((d) => {
//     switch (d.costName) {
//       case "estimatedRenevue":
//         estimatedRenevueValues = d.costValues;
//         break;
//       case "annualNetCashFlow":
//         annualNetCashFlowValues = d.costValues;
//         break;
//       default:
//         break;
//     }
//   });

//   return years.map((y) => ({
//     year: y,
//     estimatedRevenue: estimatedRenevueValues[y],
//     annualNetCashFlow: annualNetCashFlowValues[y],
//   }));
// }

export { getBreakdownYears };

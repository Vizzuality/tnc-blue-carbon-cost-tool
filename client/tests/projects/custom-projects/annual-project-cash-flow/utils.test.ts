import { YearlyBreakdown } from "@shared/dtos/custom-projects/custom-project-output.dto";

import { parseYearlyBreakdownForChart } from "@/containers/projects/custom-project/annual-project-cash-flow/utils";

describe("parseYearlyBreakdownForChart", () => {
  it("transforms yearly issued credits into a cumulative credit series", () => {
    const data: YearlyBreakdown[] = [
      {
        costName: "creditsIssuedPlan",
        totalCost: 30,
        totalNPV: 24,
        costValues: { 1: 4, 2: 6 },
      },
    ];

    expect(parseYearlyBreakdownForChart(data, [1, 2, 3])).toEqual([
      expect.objectContaining({
        year: 1,
        creditsIssuedPlan: 4,
        cumulativeCreditsPlan: 4,
      }),
      expect.objectContaining({
        year: 2,
        creditsIssuedPlan: 6,
        cumulativeCreditsPlan: 10,
      }),
      expect.objectContaining({
        year: 3,
        creditsIssuedPlan: 0,
        cumulativeCreditsPlan: 10,
      }),
    ]);
  });
});

import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { SequestrationRatesCalculator } from '@api/modules/calculations/sequestration-rate.calculator';

export class RevenueProfitCalculator {
  private project: ConservationProject;
  private sequestrationCreditsCalculator: SequestrationRatesCalculator;
  private projectLength: number;
  private defaultProjectLength: number;

  constructor(
    project: ConservationProject,
    projectLength: number,
    defaultProjectLength: number,
    sequestrationCreditsCalculator: SequestrationRatesCalculator,
  ) {
    this.project = project;
    this.sequestrationCreditsCalculator = sequestrationCreditsCalculator;
    this.projectLength = projectLength;
    this.defaultProjectLength = defaultProjectLength;
  }

  public calculateEstimatedRevenue(): { [year: number]: number } {
    const estimatedRevenuePlan: { [year: number]: number } = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        estimatedRevenuePlan[year] = 0;
      }
    }

    const estimatedCreditsIssued =
      this.sequestrationCreditsCalculator.calculateEstimatedCreditsIssued();

    for (const year in estimatedRevenuePlan) {
      const yearNum = Number(year);
      if (yearNum <= this.projectLength) {
        if (yearNum < -1) {
          estimatedRevenuePlan[yearNum] = 0;
        } else {
          estimatedRevenuePlan[yearNum] =
            estimatedCreditsIssued[yearNum] *
            this.project.carbonPrice *
            Math.pow(1 + this.project.carbonPriceIncrease, yearNum);
        }
      } else {
        estimatedRevenuePlan[yearNum] = 0;
      }
    }

    return estimatedRevenuePlan;
  }

  public calculateAnnualNetCashFlow(
    capexTotalCostPlan: { [year: number]: number },
    opexTotalCostPlan: { [year: number]: number },
  ): { [year: number]: number } {
    const estimatedRevenue = this.calculateEstimatedRevenue();
    const costPlans = {
      capexTotal: { ...capexTotalCostPlan },
      opexTotal: { ...opexTotalCostPlan },
    };

    for (const key in costPlans) {
      for (const year in costPlans[key]) {
        costPlans[key][year] = -costPlans[key][year];
      }
    }

    const totalCostPlan: { [year: number]: number } = {};
    for (const year of new Set([
      ...Object.keys(costPlans.capexTotal),
      ...Object.keys(costPlans.opexTotal),
    ])) {
      const yearNum = Number(year);
      totalCostPlan[yearNum] =
        (costPlans.capexTotal[yearNum] || 0) +
        (costPlans.opexTotal[yearNum] || 0);
    }

    const annualNetCashFlow: { [year: number]: number } = {};
    for (let year = -4; year <= this.projectLength; year++) {
      if (year !== 0) {
        annualNetCashFlow[year] =
          estimatedRevenue[year] + (totalCostPlan[year] || 0);
      }
    }

    return annualNetCashFlow;
  }

  public calculateAnnualNetIncome(opexTotalCostPlan: {
    [year: number]: number;
  }): { [year: number]: number } {
    const costPlans = {
      opexTotal: { ...opexTotalCostPlan },
    };

    for (const year in costPlans.opexTotal) {
      costPlans.opexTotal[year] = -costPlans.opexTotal[year];
    }

    const estimatedRevenue = this.calculateEstimatedRevenue();

    const annualNetIncome: { [year: number]: number } = {};
    for (let year = -4; year <= this.projectLength; year++) {
      if (year !== 0) {
        annualNetIncome[year] =
          estimatedRevenue[year] + (costPlans.opexTotal[year] || 0);
      }
    }

    return annualNetIncome;
  }
}

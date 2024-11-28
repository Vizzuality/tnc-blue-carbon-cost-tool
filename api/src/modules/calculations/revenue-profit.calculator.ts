import { Injectable } from '@nestjs/common';
import { ProjectInput } from '@api/modules/calculations/cost.calculator';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';

@Injectable()
export class RevenueProfitCalculator {
  sequestrationCreditsCalculator: SequestrationRateCalculator;
  projectLength: number;
  defaultProjectLength: number;
  carbonPrice: number;
  carbonPriceIncrease: number;
  constructor(projectInput: ProjectInput) {
    this.projectLength = projectInput.assumptions.projectLength;
    this.defaultProjectLength = projectInput.assumptions.defaultProjectLength;
    this.carbonPrice = projectInput.assumptions.carbonPrice;
    this.carbonPriceIncrease = projectInput.assumptions.carbonPriceIncrease;
    this.sequestrationCreditsCalculator = new SequestrationRateCalculator(
      projectInput,
    );
  }

  calculateEstimatedRevenuePlan(): CostPlanMap {
    const estimatedRevenuePlan: CostPlanMap = {};

    for (let year = -4; year <= this.defaultProjectLength; year++) {
      if (year !== 0) {
        estimatedRevenuePlan[year] = 0;
      }
    }

    const estimatedCreditsIssued =
      this.sequestrationCreditsCalculator.calculateEstimatedCreditsIssuedPlan();

    for (const yearStr in estimatedRevenuePlan) {
      const year = Number(yearStr);

      if (year <= this.projectLength) {
        if (year < -1) {
          estimatedRevenuePlan[year] = 0;
        } else {
          estimatedRevenuePlan[year] =
            estimatedCreditsIssued[year] *
            this.carbonPrice *
            Math.pow(1 + this.carbonPriceIncrease, year);
        }
      } else {
        estimatedRevenuePlan[year] = 0;
      }
    }

    return estimatedRevenuePlan;
  }

  calculateAnnualNetCashFlow(
    capexTotalCostPlan: CostPlanMap,
    opexTotalCostPlan: CostPlanMap,
  ): CostPlanMap {
    const estimatedRevenue = this.calculateEstimatedRevenuePlan();

    const costPlans = {
      capexTotal: {} as CostPlanMap,
      opexTotal: {} as CostPlanMap,
    };

    for (const [key, value] of Object.entries({
      capexTotal: capexTotalCostPlan,
      opexTotal: opexTotalCostPlan,
    })) {
      costPlans[key as 'capexTotal' | 'opexTotal'] = {};
      for (const [k, v] of Object.entries(value)) {
        costPlans[key as 'capexTotal' | 'opexTotal'][Number(k)] = -v;
      }
    }
    const totalCostPlan: CostPlanMap = {};
    const allYears = new Set([
      ...Object.keys(costPlans.capexTotal).map(Number),
      ...Object.keys(costPlans.opexTotal).map(Number),
    ]);

    for (const year of allYears) {
      totalCostPlan[year] =
        (costPlans.capexTotal[year] || 0) + (costPlans.opexTotal[year] || 0);
    }

    const annualNetCashFlow: { [year: number]: number } = {};

    for (let year = -4; year <= this.projectLength; year++) {
      if (year !== 0) {
        annualNetCashFlow[year] =
          (estimatedRevenue[year] || 0) + (totalCostPlan[year] || 0);
      } else {
        annualNetCashFlow[year] = 0;
      }
    }

    return annualNetCashFlow;
  }

  calculateAnnualNetIncome(opexTotalCostPlan: CostPlanMap): CostPlanMap {
    const costPlans = {
      opex_total: {} as { [year: number]: number },
    };

    for (const [yearStr, amount] of Object.entries(opexTotalCostPlan)) {
      costPlans.opex_total[Number(yearStr)] = -amount;
    }

    const estimatedRevenue = this.calculateEstimatedRevenuePlan();

    const annualNetIncome: { [year: number]: number } = {};

    for (let year = -4; year <= this.projectLength; year++) {
      if (year !== 0) {
        annualNetIncome[year] =
          (estimatedRevenue[year] || 0) + (costPlans.opex_total[year] || 0);
      } else {
        annualNetIncome[year] = 0;
      }
    }

    return annualNetIncome;
  }
}

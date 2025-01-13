import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CostCalculator,
  ProjectInput,
} from '@api/modules/calculations/cost.calculator';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { RevenueProfitCalculator } from '@api/modules/calculations/revenue-profit.calculator';
import {
  CustomProjectCostDetails,
  CustomProjectSummary,
  YearlyBreakdown,
} from '@shared/dtos/custom-projects/custom-project-output.dto';

export type CostOutput = {
  costPlans: any;
  summary: CustomProjectSummary;
  yearlyBreakdown: YearlyBreakdown;
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
};

@Injectable()
export class CalculationEngine {
  constructor() {}

  calculateCostOutput(dto: {
    projectInput: ProjectInput;
    baseIncrease: BaseIncrease;
    baseSize: BaseSize;
  }): CostOutput {
    const { projectInput, baseIncrease, baseSize } = dto;
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );
    const revenueProfitCalculator = new RevenueProfitCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    const costCalculator = new CostCalculator(
      projectInput,
      baseSize,
      baseIncrease,
      revenueProfitCalculator,
      sequestrationRateCalculator,
    );

    const costPlans = costCalculator.initializeCostPlans();
    return {
      costPlans,
      summary: costCalculator.getSummary(costPlans),
      yearlyBreakdown: costCalculator.getYearlyBreakdown(),
      costDetails: costCalculator.getCostDetails(costPlans),
    };
  }

  calculateBreakevenPrice(dto: {
    projectInput: ProjectInput;
    baseIncrease: BaseIncrease;
    baseSize: BaseSize;
    maxIterations: number;
    tolerance: number;
  }): number | null {
    console.time('calculateBreakevenPrice');
    const { projectInput, baseIncrease, baseSize, maxIterations, tolerance } =
      dto;
    let carbonPrice = projectInput.initialCarbonPriceAssumption;
    let npvCoveringCost, creditsIssued;

    for (let i = 0; i < maxIterations; i++) {
      projectInput.initialCarbonPriceAssumption = carbonPrice;
      const costOutput = this.calculateCostOutput({
        projectInput: projectInput,
        baseIncrease: baseIncrease,
        baseSize: baseSize,
      });

      npvCoveringCost = costOutput.summary['NPV covering cost'];
      creditsIssued = costOutput.summary['Credits issued'];

      console.log(
        'Iteration',
        i,
        ': NPV covering cost =',
        npvCoveringCost,
        ', Carbon price =',
        carbonPrice,
      );

      if (npvCoveringCost < tolerance) {
        console.log('Converged successfully.', npvCoveringCost, carbonPrice);
        console.timeEnd('calculateBreakevenPrice');
        return carbonPrice;
      }

      if (creditsIssued === 0) {
        console.log(
          'Error: Credits issued are zero, breakeven cost cannot be calculated.',
        );
        console.timeEnd('calculateBreakevenPrice');
        return null;
      }

      carbonPrice -= npvCoveringCost / creditsIssued;
    }

    console.log('Warning: Max iterations reached without convergence.');
    console.timeEnd('calculateBreakevenPrice');
    return null;
  }
}

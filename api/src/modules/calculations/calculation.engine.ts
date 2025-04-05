import { Injectable, Logger } from '@nestjs/common';
import {
  CostCalculator,
  CostPlansOutput,
  ProjectInput,
} from '@api/modules/calculations/calculators/cost.calculator';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { SequestrationRateCalculator } from '@api/modules/calculations/calculators/sequestration-rate.calculator';
import { RevenueProfitCalculator } from '@api/modules/calculations/calculators/revenue-profit.calculator';
import {
  CustomProjectCostDetails,
  CustomProjectSummary,
  YearlyBreakdown,
} from '@shared/dtos/custom-projects/custom-project-output.dto';
import { AbatementPotentialCalculator } from '@api/modules/calculations/calculators/abatement-potential.calculator';

export type CostOutput = {
  costPlans: CostPlansOutput;
  summary: CustomProjectSummary;
  yearlyBreakdown: YearlyBreakdown[];
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
};

export type CalculationInput = {
  projectInput: ProjectInput;
  baseIncrease: BaseIncrease;
  baseSize: BaseSize;
};

@Injectable()
export class CalculationEngine {
  logger = new Logger(CalculationEngine.name);
  constructor() {}

  calculateCostOutput(dto: CalculationInput): CostOutput {
    const { projectInput, baseIncrease, baseSize } = dto;
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );
    const revenueProfitCalculator = new RevenueProfitCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    const abatementPotentialCalculator = new AbatementPotentialCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    const costCalculator = new CostCalculator(
      projectInput,
      baseSize,
      baseIncrease,
      revenueProfitCalculator,
      sequestrationRateCalculator,
      abatementPotentialCalculator,
    );

    const costPlans = costCalculator.initializeCostPlans();

    const costOutput = {
      costPlans,
      summary: costCalculator.getSummary(costPlans),
      yearlyBreakdown: costCalculator.getYearlyBreakdown(costPlans),
      costDetails: costCalculator.getCostDetails(costPlans),
    };

    return costOutput;
  }

  calculateBreakevenPrice(dto: {
    projectInput: ProjectInput;
    baseIncrease: BaseIncrease;
    baseSize: BaseSize;
    maxIterations: number;
    tolerance: number;
  }): { costOutput: CostOutput; breakevenCarbonPrice: number } | null {
    const { projectInput, baseIncrease, baseSize, maxIterations, tolerance } =
      dto;
    let carbonPrice = projectInput.initialCarbonPriceAssumption;
    let npvCoveringCost, creditsIssued;

    for (let i = 0; i < maxIterations; i++) {
      projectInput.assumptions.carbonPrice = carbonPrice;

      const costOutput = this.calculateCostOutput({
        projectInput: projectInput,
        baseIncrease: baseIncrease,
        baseSize: baseSize,
      });

      // We don't have npvCoveringCost in the summary anymore but is the same a Net revenue according to Elena, just a naming change.
      // npvCoveringCost = costOutput.summary['NPV covering cost'];
      npvCoveringCost =
        costOutput.summary['Net revenue after OPEX'] ??
        costOutput.summary['Net revenue after Total cost'];
      creditsIssued = costOutput.summary['Credits issued'];

      if (Math.abs(npvCoveringCost) < tolerance) {
        this.logger.log('Breakeven cost calculated successfully.');
        return { costOutput, breakevenCarbonPrice: carbonPrice };
      }

      if (creditsIssued === 0) {
        this.logger.error(
          'Credits issued are zero, breakeven cost cannot be calculated.',
        );
        return null;
      }

      carbonPrice -= npvCoveringCost / creditsIssued;
    }

    this.logger.error('Max iterations reached without convergence.');
    return null;
  }
}

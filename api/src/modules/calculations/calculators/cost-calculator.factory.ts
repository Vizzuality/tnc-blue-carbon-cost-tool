import { Injectable } from '@nestjs/common';
import {
  CalculatorDependencies,
  EngineInputV2,
  ProjectInputV2,
  SequestrationRateOutputs,
} from '@api/modules/calculations/types';
import { SequestrationRateCalculator } from '@api/modules/calculations/calculators/sequestration-rate.calculator';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';
import { RevenueProfitCalculator } from '@api/modules/calculations/calculators/revenue-profit.calculator';
import { CostCalculator } from '@api/modules/calculations/calculators/cost.calculator';

/**
 * @description: Responsible for creating and assembling all the dependencies required for a cost calculation
 */

@Injectable()
export class CostCalculatorFactory {
  /**
   * @description: Assembles the dependencies required for a cost calculation
   * @param input - The input for the cost calculation
   * @returns The assembled dependencies for the cost calculation
   */
  assemblyCostCalculatorDependencies(
    input: EngineInputV2,
  ): CalculatorDependencies {
    const sequestrationRateOutputs = this.computeSequestrationRateOutputs(
      input.projectInput,
    );
    const revenueProfitCalculator = this.getRevenueProfitCalculator(
      input.projectInput,
      sequestrationRateOutputs.estimatedCreditIssuedPlan,
    );
    return {
      engineInput: input,
      sequestrationRateOutputs,
      revenueProfitCalculator,
    };
  }

  /**
   * @description: Creates a new instance of the CostCalculator with the provided dependencies
   * @param dependencies - All dependencies for the cost calculation
   * @returns A new instance of the CostCalculator class
   */
  createCostCalculator(dependencies: CalculatorDependencies): CostCalculator {
    return new CostCalculator(dependencies);
  }

  computeSequestrationRateOutputs(
    projectInput: ProjectInputV2,
  ): SequestrationRateOutputs {
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );

    const estimatedCreditIssuedPlan =
      sequestrationRateCalculator.calculateEstimatedCreditsIssuedPlan();
    const areaRestoredOrConservedPlan =
      sequestrationRateCalculator.calculateAreaRestoredOrConserved();
    const annualAvoidedLoss =
      sequestrationRateCalculator.calculateAnnualAvoidedLoss();
    const netEmissionsReduction =
      sequestrationRateCalculator.calculateNetEmissionsReductions();

    return {
      estimatedCreditIssuedPlan,
      areaRestoredOrConservedPlan,
      annualAvoidedLoss,
      netEmissionsReduction,
    };
  }

  getRevenueProfitCalculator(
    projectInput: ProjectInputV2,
    estimatedCreditIssuedPlan: CostPlanMap,
  ): RevenueProfitCalculator {
    const revenueProfitCalculator = new RevenueProfitCalculator(
      projectInput,
      estimatedCreditIssuedPlan,
    );
    return revenueProfitCalculator;
  }
}

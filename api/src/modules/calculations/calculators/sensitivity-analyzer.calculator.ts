import {
  COST_KEYS,
  CostCalculator,
  CostPlansOutput,
  ProjectInput,
} from '@api/modules/calculations/calculators/cost.calculator';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { RevenueProfitCalculator } from '@api/modules/calculations/calculators/revenue-profit.calculator';
import { AbatementPotentialCalculator } from '@api/modules/calculations/calculators/abatement-potential.calculator';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';

// FE might need to have this keys in a specific order
export type SensitivityAnalysisResults = Record<
  COST_KEYS,
  {
    decreased25: number;
    increased25: number;
    baseValue: number;
    changePctLower: number;
    changePctHigher: number;
  }
>;

/**
 * @description: Runs a sensitivity analysis on the project input by modifying the cost inputs by +/- 25% and calculating the cost output for each case.
 */

export type SensitivityAnalysisInput = {
  baseProjectInput: ProjectInput;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  revenueProfitCalculator: RevenueProfitCalculator;
  abatementPotentialCalculator: AbatementPotentialCalculator;
  estimatedCreditsIssuedPlan: CostPlanMap;
  areaRestoredOrConservedPlan: CostPlanMap;
  initialCostPlanOutput: CostPlansOutput;
};

export class SensitivityAnalyzer {
  input: SensitivityAnalysisInput;
  constructor(input: SensitivityAnalysisInput) {
    this.input = input;
  }

  run(): SensitivityAnalysisResults {
    const results: SensitivityAnalysisResults =
      {} as SensitivityAnalysisResults;
    const baseValue = this.input.initialCostPlanOutput.costPerTCO2e;

    for (const costKey of Object.values(COST_KEYS)) {
      const decreased25 = this.calculateModifiedCost(costKey, 0.75);
      const increased25 = this.calculateModifiedCost(costKey, 1.25);
      const changePctLower = this.computePercentageDifference(
        decreased25,
        baseValue,
      );
      const changePctHigher = this.computePercentageDifference(
        increased25,
        baseValue,
      );
      results[costKey] = {
        decreased25,
        increased25,
        baseValue,
        changePctLower,
        changePctHigher,
      };
    }

    return results;
  }

  private calculateModifiedCost(costKey: COST_KEYS, factor: number): number {
    // Clone the original input to avoid modifying it directly
    const modifiedInput: ProjectInput = structuredClone(
      this.input.baseProjectInput,
    );

    // Modify the specific cost input by the given factor
    const currentValue = modifiedInput.costAndCarbonInputs[costKey];
    modifiedInput.costAndCarbonInputs[costKey] = currentValue * factor || 0;

    // Create a new CostCalculator instance with the modified input
    const calculator = this.getCalculator(modifiedInput);

    // Run calculations with the modified input
    const modifiedOutput = calculator.initializeCostPlans();

    // Return the cost per TCO2e from the modified output
    return modifiedOutput.costPerTCO2e;
  }

  private computePercentageDifference(modified: number, base: number): number {
    return (modified - base) / base || 0;
  }

  private getCalculator(modifiedProjectInput: ProjectInput): CostCalculator {
    return new CostCalculator(
      modifiedProjectInput,
      this.input.baseSize,
      this.input.baseIncrease,
      this.input.revenueProfitCalculator,
      this.input.abatementPotentialCalculator,
      this.input.estimatedCreditsIssuedPlan,
      this.input.areaRestoredOrConservedPlan,
    );
  }
}

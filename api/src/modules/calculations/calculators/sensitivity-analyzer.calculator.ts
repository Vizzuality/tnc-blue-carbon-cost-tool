import { CostCalculator } from '@api/modules/calculations/calculators/cost.calculator';
import {
  CalculatorDependencies,
  COST_KEYS,
  ProjectInput,
  SensitivityAnalysisInput,
  SensitivityAnalysisResults,
} from '@api/modules/calculations/types';

/**
 * @description: Runs a sensitivity analysis on the project input by modifying the cost inputs by +/- 25% and calculating the cost output for each case.
 */

export class SensitivityAnalyzer {
  input: SensitivityAnalysisInput;
  projectInput: ProjectInput;
  constructor(input: SensitivityAnalysisInput) {
    this.input = input;
    this.projectInput = input.engineInput.projectInput;
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
    const modifiedInput: ProjectInput = structuredClone(this.projectInput);

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
    const calculatorDependencies: CalculatorDependencies = {
      engineInput: {
        projectInput: modifiedProjectInput,
        baseSize: this.input.engineInput.baseSize,
        baseIncrease: this.input.engineInput.baseIncrease,
      },
      sequestrationRateOutputs: this.input.sequestrationRateOutputs,
      revenueProfitCalculator: this.input.revenueProfitCalculator,
    };
    return new CostCalculator(calculatorDependencies);
  }
}

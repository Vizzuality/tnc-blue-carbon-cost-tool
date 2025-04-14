import { Injectable, Logger } from '@nestjs/common';
import { ProjectInput } from '@api/modules/calculations/calculators/cost.calculator';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { AbatementPotentialCalculator } from '@api/modules/calculations/calculators/abatement-potential.calculator';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { CostCalculatorFactory } from '@api/modules/calculations/calculators/cost-calculator.factory';
import {
  AbatementPotentialInput,
  AbatementPotentialOutput,
  BreakEvenOutput,
  CalculatorDependencies,
  SensitivityAnalysisInput,
  SensitivityAnalysisResults,
} from '@api/modules/calculations/types';
import { CostOutput } from '@api/modules/calculations/types';
import { SensitivityAnalyzer } from '@api/modules/calculations/calculators/sensitivity-analyzer.calculator';

export type EngineInput = {
  projectInput: ProjectInput;
  baseIncrease: BaseIncrease;
  baseSize: BaseSize;
};

export
@Injectable()
class CalculationEngine {
  logger = new Logger(CalculationEngine.name);
  constructor(private readonly costCalculatorFactory: CostCalculatorFactory) {}

  calculate(input: EngineInput) {
    const dependencies: CalculatorDependencies =
      this.costCalculatorFactory.assemblyCostCalculatorDependencies(input);
    const costOutput = this.calculateCostOutput(dependencies, true);

    const breakEvenCostOutput = this.calculateBreakevenPrice(input);

    return {
      costOutput,
      breakEvenCostOutput,
    };
  }

  calculateCostOutput(
    dependencies: CalculatorDependencies,
    completeComputation: boolean,
  ): CostOutput {
    const costCalculator =
      this.costCalculatorFactory.createCostCalculator(dependencies);

    const costPlans = costCalculator.initializeCostPlans();

    const costOutput: CostOutput = {
      costPlans: costPlans,
      summary: costCalculator.getSummary(costPlans),
      yearlyBreakdown: costCalculator.getYearlyBreakdown(costPlans),
      costDetails: costCalculator.getCostDetails(costPlans),
    };

    if (completeComputation) {
      const sensitivityAnalysis = this.runSensitivityAnalysis({
        ...dependencies,
        initialCostPlanOutput: costPlans,
      });
      costOutput.sensitivityAnalysis = sensitivityAnalysis;

      const { abatementPotential, countryAbatementPotential } =
        this.computeAbatementPotential({
          projectInput: dependencies.engineInput.projectInput,
          annualAvoidedLoss:
            dependencies.sequestrationRateOutputs.annualAvoidedLoss,
          netEmissionsReduction:
            dependencies.sequestrationRateOutputs.netEmissionsReduction,
        });
      costOutput.costPlans.abatementPotential = abatementPotential;
      costOutput.costPlans.countryAbatementPotential =
        countryAbatementPotential;
    }

    return costOutput;
  }

  calculateBreakevenPrice(dto: EngineInput): BreakEvenOutput {
    const { projectInput } = dto;
    const projectInputClone =
      projectInput.activity === ACTIVITY.CONSERVATION
        ? Object.assign(
            new ConservationProjectInput(),
            structuredClone(projectInput),
          )
        : Object.assign(
            new RestorationProjectInput(),
            structuredClone(projectInput),
          );

    const maxIterations = 100;
    const tolerance = 0.00001;
    let carbonPrice = projectInputClone.initialCarbonPriceAssumption;
    let npvCoveringCost: number, creditsIssued: number;

    for (let i = 0; i < maxIterations; i++) {
      projectInputClone.assumptions.carbonPrice = carbonPrice;
      const dependencies: CalculatorDependencies =
        this.costCalculatorFactory.assemblyCostCalculatorDependencies({
          ...dto,
          projectInput: projectInputClone,
        });

      const breakEvenCost = this.calculateCostOutput(dependencies, false);

      // We don't have npvCoveringCost in the summary anymore but is the same a Net revenue according to Elena, just a naming change.
      // npvCoveringCost = costOutput.summary['NPV covering cost'];
      npvCoveringCost =
        breakEvenCost.summary['Net revenue after OPEX'] ??
        breakEvenCost.summary['Net revenue after Total cost'];
      creditsIssued = breakEvenCost.summary['Credits issued'];

      if (Math.abs(npvCoveringCost) < tolerance) {
        this.logger.log('Breakeven cost calculated successfully.');
        // We want to compute the sensitivity analysis only if the breakeven cost is calculated successfully
        const sensitivityAnalysis = this.runSensitivityAnalysis({
          ...dependencies,
          initialCostPlanOutput: breakEvenCost.costPlans,
        });
        // We also want to compute abatement potential only if the breakeven cost is calculated successfully
        const { abatementPotential, countryAbatementPotential } =
          this.computeAbatementPotential({
            projectInput: projectInputClone,
            annualAvoidedLoss:
              dependencies.sequestrationRateOutputs.annualAvoidedLoss,
            netEmissionsReduction:
              dependencies.sequestrationRateOutputs.netEmissionsReduction,
          });
        breakEvenCost.sensitivityAnalysis = sensitivityAnalysis;
        breakEvenCost.costPlans.abatementPotential = abatementPotential;
        breakEvenCost.costPlans.countryAbatementPotential =
          countryAbatementPotential;
        return { breakEvenCost, breakEvenCarbonPrice: carbonPrice };
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

  runSensitivityAnalysis(
    sensitivityInput: SensitivityAnalysisInput,
  ): SensitivityAnalysisResults {
    const analyzer = new SensitivityAnalyzer(sensitivityInput);

    return analyzer.run();
  }

  computeAbatementPotential(
    input: AbatementPotentialInput,
  ): AbatementPotentialOutput {
    const abatementPotentialCalculator = new AbatementPotentialCalculator(
      input,
    );

    const countryAbatementPotential =
      abatementPotentialCalculator.calculateCountryLevelAbatementPotential();
    const abatementPotential =
      abatementPotentialCalculator.calculateProjectLevelAbatementPotential();

    return { abatementPotential, countryAbatementPotential };
  }
}

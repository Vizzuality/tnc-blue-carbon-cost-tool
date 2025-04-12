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
  CostPlanMap,
  CustomProjectCostDetails,
  CustomProjectSummary,
  YearlyBreakdown,
} from '@shared/dtos/custom-projects/custom-project-output.dto';
import { AbatementPotentialCalculator } from '@api/modules/calculations/calculators/abatement-potential.calculator';
import {
  SensitivityAnalysisInput,
  SensitivityAnalysisResults,
  SensitivityAnalyzer,
} from '@api/modules/calculations/calculators/sensitivity-analyzer.calculator';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';

export type CostOutput = {
  costPlans: CostPlansOutput;
  summary: CustomProjectSummary;
  yearlyBreakdown: YearlyBreakdown[];
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
  sensitivityAnalysis?: SensitivityAnalysisResults;
};

export type EngineInput = {
  projectInput: ProjectInput;
  baseIncrease: BaseIncrease;
  baseSize: BaseSize;
};

export type BreakEvenInput = CalculatorInput & {
  maxIterations: number;
  tolerance: number;
};

export type BreakEvenOutput = {
  breakEvenCost: CostOutput;
  breakEvenCarbonPrice: number;
} | null;

export type CalculatorInput = {
  projectInput: ProjectInput;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  revenueProfitCalculator?: RevenueProfitCalculator;
  abatementPotentialCalculator?: AbatementPotentialCalculator;
  estimatedCreditIssuedPlan?: CostPlanMap;
  areaRestoredOrConservedPlan?: CostPlanMap;
};

export
@Injectable()
class CalculationEngine {
  logger = new Logger(CalculationEngine.name);
  constructor() {}

  calculate(input: EngineInput) {
    const costOutput = this.calculateCostOutput(
      {
        ...input,
      },
      true,
    );

    const breakEvenCostOutput = this.calculateBreakevenPrice({
      ...input,
    });

    return {
      costOutput,
      breakEvenCostOutput,
    };
  }

  calculateCostOutput(
    dto: CalculatorInput,
    runSensitivityAnalysis: boolean,
  ): CostOutput {
    const { projectInput, baseIncrease, baseSize } = dto;

    const {
      areaRestoredOrConservedPlan,
      abatementPotentialCalculator,
      estimatedCreditIssuedPlan,
      revenueProfitCalculator,
    } = this.setUp(projectInput);

    const costCalculator = new CostCalculator(
      projectInput,
      baseSize,
      baseIncrease,
      revenueProfitCalculator,
      abatementPotentialCalculator,
      estimatedCreditIssuedPlan,
      areaRestoredOrConservedPlan,
    );

    const costPlans = costCalculator.initializeCostPlans();

    const costOutput: CostOutput = {
      costPlans,
      summary: costCalculator.getSummary(costPlans),
      yearlyBreakdown: costCalculator.getYearlyBreakdown(costPlans),
      costDetails: costCalculator.getCostDetails(costPlans),
    };

    if (runSensitivityAnalysis) {
      const sensitivityAnalysis = this.runSensitivityAnalysis({
        baseProjectInput: projectInput,
        baseIncrease,
        baseSize,
        initialCostPlanOutput: costPlans,
        estimatedCreditsIssuedPlan: estimatedCreditIssuedPlan,
        areaRestoredOrConservedPlan,
        revenueProfitCalculator,
        abatementPotentialCalculator,
      });
      costOutput.sensitivityAnalysis = sensitivityAnalysis;
    }

    return costOutput;
  }

  calculateBreakevenPrice(dto: CalculatorInput): BreakEvenOutput {
    const { projectInput, baseIncrease, baseSize } = dto;
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
      const {
        areaRestoredOrConservedPlan,
        estimatedCreditIssuedPlan,
        revenueProfitCalculator,
        abatementPotentialCalculator,
      } = this.setUp(projectInputClone);

      const breakEvenCost = this.calculateCostOutput(
        {
          projectInput: projectInputClone,
          baseIncrease,
          baseSize,
          revenueProfitCalculator,
          abatementPotentialCalculator,
          estimatedCreditIssuedPlan,
          areaRestoredOrConservedPlan,
        },
        false,
      );

      // We don't have npvCoveringCost in the summary anymore but is the same a Net revenue according to Elena, just a naming change.
      // npvCoveringCost = costOutput.summary['NPV covering cost'];
      npvCoveringCost =
        breakEvenCost.summary['Net revenue after OPEX'] ??
        breakEvenCost.summary['Net revenue after Total cost'];
      creditsIssued = breakEvenCost.summary['Credits issued'];

      if (Math.abs(npvCoveringCost) < tolerance) {
        this.logger.log('Breakeven cost calculated successfully.');
        const analyzer = new SensitivityAnalyzer({
          baseProjectInput: projectInputClone,
          baseIncrease,
          baseSize,
          initialCostPlanOutput: breakEvenCost.costPlans,
          estimatedCreditsIssuedPlan: estimatedCreditIssuedPlan,
          areaRestoredOrConservedPlan: areaRestoredOrConservedPlan,
          revenueProfitCalculator,
          abatementPotentialCalculator,
        });
        const sensitivityAnalysis = analyzer.run();
        breakEvenCost.sensitivityAnalysis = sensitivityAnalysis;
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

  setUp(projectInput: ProjectInput) {
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );

    // This costs seems to be only calculated once with no parameters so probably I can calculate them once and reuse them in the sensitivity analysis loop
    // tests are passing with this change, looks good
    const estimatedCreditIssuedPlan =
      sequestrationRateCalculator.calculateEstimatedCreditsIssuedPlan();
    const areaRestoredOrConservedPlan =
      sequestrationRateCalculator.calculateAreaRestoredOrConserved();

    const revenueProfitCalculator = new RevenueProfitCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    const abatementPotentialCalculator = new AbatementPotentialCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    return {
      revenueProfitCalculator,
      abatementPotentialCalculator,
      estimatedCreditIssuedPlan,
      areaRestoredOrConservedPlan,
    };
  }

  runSensitivityAnalysis(
    sensitivityInput: SensitivityAnalysisInput,
  ): SensitivityAnalysisResults {
    const analyzer = new SensitivityAnalyzer(sensitivityInput);

    return analyzer.run();
  }
}

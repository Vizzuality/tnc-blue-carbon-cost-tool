import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { ProjectInput } from '@api/modules/calculations/calculators/cost.calculator';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { RevenueProfitCalculator } from '@api/modules/calculations/calculators/revenue-profit.calculator';
import {
  CalculatorCostPlansOutput,
  SequestrationRateOutputs,
} from '@api/modules/calculations/types/output-types';
import { CostPlanMap } from '@api/modules/calculations/types/cost-types';

// Input for calculation engine

export type EngineInputV2 = {
  projectInput: ProjectInput;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
};

// Input with project data to compute costs for

export type ProjectInputV2 = ConservationProjectInput | RestorationProjectInput;

// Input for cost calculator
export type CalculatorDependencies = { engineInput: EngineInputV2 } & {
  sequestrationRateOutputs: SequestrationRateOutputs;
} & {
  revenueProfitCalculator: RevenueProfitCalculator;
};

// Input for sensitivity analysis
export type SensitivityAnalysisInput = CalculatorDependencies & {
  initialCostPlanOutput: CalculatorCostPlansOutput;
};

export type AbatementPotentialInput = {
  projectInput: ProjectInput;
  annualAvoidedLoss: CostPlanMap;
  netEmissionsReduction: CostPlanMap;
};

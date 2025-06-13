import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { RevenueProfitCalculator } from '@api/modules/calculations/calculators/revenue-profit.calculator';
import {
  CalculatorCostPlansOutput,
  SequestrationRateOutputs,
} from '@api/modules/calculations/types/output-types';
import { CostPlanMap } from '@api/modules/calculations/types/cost-types';
import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';

// Input for calculation engine

export type EngineInput = {
  projectInput: ProjectInput;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  dto: CreateCustomProjectDto;
};

// Input with project data to compute costs for

export type ProjectInput = ConservationProjectInput | RestorationProjectInput;

// Input for cost calculator
export type CalculatorDependencies = { engineInput: EngineInput } & {
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

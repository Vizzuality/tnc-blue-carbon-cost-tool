import {
  COST_KEYS,
  CostPlanMap,
} from '@api/modules/calculations/types/cost-types';
import { CostOutput } from '@api/modules/calculations/types/computed-project-types';

/**
 * @description Outputs for the sequestration rate calculator. These outputs can be computed only once and injected into the relevant input.
 * This approach avoids injecting the entire `SequestrationRateCalculator` into the main calculator and prevents recomputing these costs.
 * The costs are computed once for the main calculator but involve several loops for the break-even price and sensitivity analysis,
 * which are currently event loop blocking.
 */
export type SequestrationRateOutputs = {
  annualAvoidedLoss: CostPlanMap;
  netEmissionsReduction: CostPlanMap;
  estimatedCreditIssuedPlan: CostPlanMap;
  areaRestoredOrConservedPlan: CostPlanMap;
  baselineEmissionsCostPlan: CostPlanMap;
};

/**
 * @description: Cost Plan output for the Cost Calculator. Provides a initial cost plan that can be used later on for break-even price and sensitivity analysis.
 *               This output does not include sensitivity analysis or break-even price calculations, that can be computed once and avoid recomputing all costs
 */

export type CalculatorCostPlansOutput = {
  totalOpex: number;
  totalCapex: number;
  totalCapexNPV: number;
  totalOpexNPV: number;
  totalNPV: number;
  costPerTCO2e: number;
  costPerHa: number;
  npvCoveringCosts: number;
  totalCreditsIssued: number;
  IRROpex: number;
  IRRTotalCost: number;
  totalRevenueNPV: number;
  totalRevenue: number;
  financingCost: number;
  fundingGap: number;
  fundingGapNPV: number;
  fundingGapPerTCO2e: number;
  totalCommunityBenefitSharingFund: number;
  annualNetCashFlow: CostPlanMap;
  annualNetIncome: CostPlanMap;
  estimatedRevenuePlan: CostPlanMap;
  creditsIssuedPlan: CostPlanMap;
  abatementPotential?: number;
  countryAbatementPotential?: number;
};

/**
 * @description: Output for the cost calculator. This output includes the calculator output and the abatement potential output.
 */
export type CostPlansOutput = CalculatorCostPlansOutput &
  AbatementPotentialOutput;

/**
 * @description: Output for abatement potential calculator, which includes project level abatement potential (named as just abatement potential) and country level abatement potential.
 */
export type AbatementPotentialOutput = {
  abatementPotential: number;
  countryAbatementPotential: number;
};

/**
 * @description: Results of the sensitivity analysis
 */
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
 * @description: Output for the break-even price calculator. This output includes the break-even cost and the break-even carbon price.
 *                The break-even cost is the cost output of the cost calculator, while the break-even carbon price is the carbon price used to calculate the break-even cost.
 *                It can be null as the computing algorithm might not be able to reach convergence within the defined iterations and given tolerance.
 */
export type BreakEvenOutput = {
  breakEvenCost: CostOutput;
  breakEvenCarbonPrice: number;
} | null;

/**
 * @description: Output for the calculation engine. This output includes the cost output and the break-even cost output.
 *                The break-even cost output is optional as it can be null if the break-even cost cannot be calculated.
 */

export type CalculationEngineOutput = {
  costOutput: CostOutput;
  breakEvenCostOutput?: BreakEvenOutput;
};

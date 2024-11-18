/**
 * @description: Once we understand how the cost is calculated, we might move the common logic to this class, and extend it for each specific project type
 */
import { Injectable } from '@nestjs/common';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { SequestrationRatesCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { RevenueProfitCalculator } from '@api/modules/calculations/revenue-profit.calculators';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';

type CostPlanMap = {
  [year: number]: number;
};

// @Injectable()
// export class CostCalculatorToImplement {
//   constructor(
//     private readonly sequestrationRateCalculator: SequestrationRatesCalculator,
//     private readonly revenueProfitCalculator: RevenueProfitCalculator,
//   ) {}
//
//   private createCostPlan(defaultProjectLength: number): CostPlan {}
//
//   calculateConservationProjectCosts(
//     projectInput: ConservationProjectInput,
//     defaultProjectLength: number,
//   ) {}
// }

type CostPlans = Record<keyof CostInputs, CostPlanMap>;

export enum COST_KEYS {
  FEASIBILITY_ANALYSIS = 'feasibilityAnalysis',
  CONSERVATION_PLANNING_AND_ADMIN = 'conservationPlanningAndAdmin',
  DATA_COLLECTION_AND_FIELD_COST = 'dataCollectionAndFieldCost',
  COMMUNITY_REPRESENTATION = 'communityRepresentation',
  BLUE_CARBON_PROJECT_PLANNING = 'blueCarbonProjectPlanning',
  ESTABLISHING_CARBON_RIGHTS = 'establishingCarbonRights',
  FINANCING_COST = 'financingCost',
  VALIDATION = 'validation',
  MONITORING = 'monitoring',
  BASELINE_REASSESSMENT = 'baselineReassessment',
  MRV = 'mrv',
  LONG_TERM_PROJECT_OPERATING_COST = 'longTermProjectOperatingCost',
}

type ProjectInput = ConservationProjectInput | RestorationProjectInput;

export class CostCalculator {
  projectInput: ProjectInput;
  defaultProjectLength: number;
  startingPointScaling: number;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  capexTotalCostPlan: CostPlanMap;
  opexTotalCostPlan: CostPlanMap;
  costPlans: CostPlans;
  constructor(
    projectInput: ProjectInput,
    defaultProjectLength: number,
    startingPointScaling: number,
    baseSize: BaseSize,
    baseIncrease: BaseIncrease,
  ) {
    this.projectInput = projectInput;
    this.defaultProjectLength = defaultProjectLength;
    this.startingPointScaling = startingPointScaling;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
  }

  initializeCostPlans() {
    this.capexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
    this.opexTotalCostPlan = this.initializeTotalCostPlan(
      this.defaultProjectLength,
    );
  }

  /**
   * @description: Initialize the cost plan with the default project length, with 0 costs for each year
   * @param defaultProjectLength
   */
  private initializeTotalCostPlan(defaultProjectLength: number): CostPlanMap {
    const costPlan: CostPlanMap = {};
    for (let i = 1; i <= defaultProjectLength; i++) {
      costPlan[i] = 0;
    }
    return costPlan;
  }

  private createSimpleCostPlan(
    totalBaseCost: number,
    years = [-4, -3, -2, -1],
  ) {
    const costPlan: CostPlanMap = {};
    years.forEach((year) => {
      costPlan[year] = totalBaseCost;
    });
    return costPlan;
  }

  private getTotalBaseCost(costType: COST_KEYS): number {
    const baseCost = this.projectInput.costInputs[costType];
    const increasedBy: number = this.baseIncrease[costType];
    const sizeDifference =
      this.projectInput.projectSizeHa - this.startingPointScaling;
    const scalingFactor = Math.max(Math.round(sizeDifference / baseCost), 0);
    const totalBaseCost = baseCost + increasedBy * scalingFactor * baseCost;
    this.throwIfValueIsNotValid(totalBaseCost, costType);
    return totalBaseCost;
  }

  private calculateFeasibilityAnalysisCosts() {
    const totalBaseCost = this.getTotalBaseCost(COST_KEYS.FEASIBILITY_ANALYSIS);
    const feasibilityAnalysisCostPlan = this.createSimpleCostPlan(
      totalBaseCost,
      [-4],
    );
    return feasibilityAnalysisCostPlan;
  }

  private throwIfValueIsNotValid(value: number, costKey: COST_KEYS): void {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      throw new Error(`Invalid number: ${value} produced for ${costKey}`);
    }
  }

  calculateCosts() {
    // @ts-ignore
    this.costPlans = {
      feasibilityAnalysis: this.calculateFeasibilityAnalysisCosts(),
    };
  }
}

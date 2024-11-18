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

type CostPlan = {
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

type ProjectInput = ConservationProjectInput | RestorationProjectInput;

export class CostCalculator {
  projectInput: ProjectInput;
  defaultProjectLength: number;
  baseSize: BaseSize;
  baseIncrease: BaseIncrease;
  capexTotalCostPlan: CostPlan;
  opexTotalCostPlan: CostPlan;
  constructor(
    projectInput: ProjectInput,
    defaultProjectLength: number,
    baseSize: BaseSize,
    baseIncrease: BaseIncrease,
  ) {
    this.projectInput = projectInput;
    this.defaultProjectLength = defaultProjectLength;
    this.baseIncrease = baseIncrease;
    this.baseSize = baseSize;
  }

  initializeCostPlans() {
    this.capexTotalCostPlan = this.initializeCostPlan(
      this.defaultProjectLength,
    );
    this.opexTotalCostPlan = this.initializeCostPlan(this.defaultProjectLength);
  }

  /**
   * @description: Initialize the cost plan with the default project length, with 0 costs for each year
   * @param defaultProjectLength
   */
  private initializeCostPlan(defaultProjectLength: number): CostPlan {
    const costPlan: CostPlan = {};
    for (let i = 1; i <= defaultProjectLength; i++) {
      costPlan[i] = 0;
    }
    return costPlan;
  }
}

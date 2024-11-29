import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CostCalculator,
  ProjectInput,
} from '@api/modules/calculations/cost.calculator';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { SequestrationRateCalculator } from '@api/modules/calculations/sequestration-rate.calculator';
import { RevenueProfitCalculator } from '@api/modules/calculations/revenue-profit.calculator';
import {
  CustomProjectCostDetails,
  CustomProjectSummary,
  YearlyBreakdown,
} from '@shared/dtos/custom-projects/custom-project-output.dto';

export type CostOutput = {
  costPlans: any;
  summary: CustomProjectSummary;
  yearlyBreakdown: YearlyBreakdown;
  costDetails: {
    total: CustomProjectCostDetails;
    npv: CustomProjectCostDetails;
  };
};

@Injectable()
export class CalculationEngine {
  constructor() {}

  calculateCostOutput(dto: {
    projectInput: ProjectInput;
    baseIncrease: BaseIncrease;
    baseSize: BaseSize;
  }): CostOutput {
    const { projectInput, baseIncrease, baseSize } = dto;
    const sequestrationRateCalculator = new SequestrationRateCalculator(
      projectInput,
    );
    const revenueProfitCalculator = new RevenueProfitCalculator(
      projectInput,
      sequestrationRateCalculator,
    );

    const costCalculator = new CostCalculator(
      projectInput,
      baseSize,
      baseIncrease,
      revenueProfitCalculator,
      sequestrationRateCalculator,
    );

    const costPlans = costCalculator.initializeCostPlans();
    return {
      costPlans,
      summary: costCalculator.getSummary(costPlans),
      yearlyBreakdown: costCalculator.getYearlyBreakdown(),
      costDetails: costCalculator.getCostDetails(costPlans),
    };
  }
}

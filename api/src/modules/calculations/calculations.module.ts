import { Module } from '@nestjs/common';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { CostCalculatorFactory } from '@api/modules/calculations/calculators/cost-calculator.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BaseDataView,
      ModelAssumptions,
      BaseIncrease,
      BaseSize,
    ]),
  ],
  providers: [
    CalculationEngine,
    DataRepository,
    AssumptionsRepository,
    CostCalculatorFactory,
  ],
  exports: [CalculationEngine, DataRepository, AssumptionsRepository],
})
export class CalculationsModule {}

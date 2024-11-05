import { Module } from '@nestjs/common';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';

@Module({
  providers: [CalculationEngine],
  exports: [CalculationEngine],
})
export class CalculationsModule {}

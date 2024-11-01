import { Module } from '@nestjs/common';
import { CalculationEngine } from './calculation.engine';

@Module({
  providers: [CalculationEngine],
  exports: [CalculationEngine],
})
export class CalculationEngineModule {}

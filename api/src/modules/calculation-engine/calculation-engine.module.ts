import { Module } from '@nestjs/common';
import { CalculationEngineService } from './calculation-engine.service';

@Module({
  providers: [CalculationEngineService],
})
export class CalculationEngineModule {}

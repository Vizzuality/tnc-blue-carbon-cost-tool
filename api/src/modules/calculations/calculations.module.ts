import { Module } from '@nestjs/common';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDataView } from '@shared/entities/base-data.view';
import { DataRepository } from '@api/modules/calculations/data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BaseDataView])],
  providers: [CalculationEngine, DataRepository],
  exports: [CalculationEngine, DataRepository],
})
export class CalculationsModule {}

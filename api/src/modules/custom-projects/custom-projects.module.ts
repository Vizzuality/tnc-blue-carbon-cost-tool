import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomProject } from '@shared/entities/custom-projects.entity';
import { CustomProjectsController } from './custom-projects.controller';
import { CalculationEngineModule } from '@api/modules/calculation-engine/calculation-engine.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomProject]), CalculationEngineModule],
  controllers: [CustomProjectsController],
})
export class CustomProjectsModule {}

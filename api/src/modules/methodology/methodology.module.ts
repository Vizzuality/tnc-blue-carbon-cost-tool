import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { MethodologyController } from '@api/modules/methodology/methodology.controller';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModelAssumptions])],
  controllers: [MethodologyController],
  providers: [AssumptionsRepository, MethodologyRepository, MethodologyService],
})
export class MethodologyModule {}

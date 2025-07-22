import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { MethodologyController } from '@api/modules/methodology/methodology.controller';
import { MethodologyRepository } from '@api/modules/methodology/methodology.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { ChangelogService } from '@api/modules/methodology/changelog.service';
import { DataIngestionEntity } from '@shared/entities/model-versioning/data-ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModelAssumptions, DataIngestionEntity])],
  controllers: [MethodologyController],
  providers: [
    AssumptionsRepository,
    MethodologyRepository,
    MethodologyService,
    ChangelogService,
  ],
})
export class MethodologyModule {}

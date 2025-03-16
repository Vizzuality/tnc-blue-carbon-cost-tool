import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { ExcelParserToken } from '@api/modules/import/services/excel-parser.interface';
import { ImportRepository } from '@api/modules/import/import.repository';
import { ImportEventHandler } from '@api/modules/import/events/handlers/import-event.handler';
import { DataIngestionExcelParser } from '@api/modules/import/parser/data-ingestion.xlsx-parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { CalculationsModule } from '@api/modules/calculations/calculations.module';
import { CustomProjectFactory } from '@api/modules/custom-projects/input-factory/custom-project.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectScorecard]),
    MulterModule.register({}),
    CalculationsModule,
  ],
  controllers: [ImportController],
  providers: [
    ImportService,
    EntityPreprocessor,
    ImportRepository,
    ImportEventHandler,
    CustomProjectFactory,
    DataIngestionExcelParser,
    { provide: ExcelParserToken, useClass: XlsxParser },
  ],
})
export class ImportModule {}

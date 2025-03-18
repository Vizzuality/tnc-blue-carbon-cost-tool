import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { ExcelParserToken } from '@api/modules/import/services/excel-parser.interface';
import { ImportRepository } from '@api/modules/import/import.repostiory';
import { ImportEventHandler } from '@api/modules/import/events/handlers/import-event.handler';
import { DataIngestionExcelParser } from '@api/modules/import/parser/data-ingestion.xlsx-parser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { ProjectsModule } from '@api/modules/projects/projects.module';

@Module({
  imports: [
    // TODO: After switching to compute projects, we might want to remove this from here and have it only in projects module?
    TypeOrmModule.forFeature([ProjectScorecard]),
    MulterModule.register({}),
    ProjectsModule,
  ],
  controllers: [ImportController],
  providers: [
    ImportService,
    EntityPreprocessor,
    ImportRepository,
    ImportEventHandler,
    // TODO: Which parser is being used here?
    DataIngestionExcelParser,
    { provide: ExcelParserToken, useClass: XlsxParser },
  ],
})
export class ImportModule {}

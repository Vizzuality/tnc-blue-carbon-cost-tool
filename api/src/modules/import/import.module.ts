import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { ExcelParserToken } from '@api/modules/import/services/excel-parser.interface';
import { ImportRepository } from '@api/modules/import/import.repostiory';
import { ImportEventHandler } from '@api/modules/import/events/handlers/import-event.handler';

@Module({
  imports: [MulterModule.register({})],
  controllers: [ImportController],
  providers: [
    ImportService,
    EntityPreprocessor,
    ImportRepository,
    ImportEventHandler,
    { provide: ExcelParserToken, useClass: XlsxParser },
  ],
})
export class ImportModule {}

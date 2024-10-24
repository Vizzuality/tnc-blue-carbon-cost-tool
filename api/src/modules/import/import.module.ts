import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { ModelModule } from '@api/modules/model/model.module';

@Module({
  imports: [MulterModule.register({}), ModelModule],
  controllers: [ImportController],
  providers: [
    ImportService,
    EntityPreprocessor,
    XlsxParser,
    //  { provide: ExcelParserToken, useClass: XlsxParser },
  ],
})
export class ImportModule {}

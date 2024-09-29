import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';

import { XlsxParser } from '@api/modules/import/services/xlsx.parser';

@Module({
  imports: [MulterModule.register({})],
  controllers: [ImportController],
  providers: [ImportService, XlsxParser],
})
export class ImportModule {}

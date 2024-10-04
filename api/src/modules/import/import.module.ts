import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from '@api/modules/import/import.controller';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { DataModule } from '@api/modules/base-data/data.module';

@Module({
  imports: [MulterModule.register({}), DataModule],
  controllers: [ImportController],
  providers: [ImportService, XlsxParser],
})
export class ImportModule {}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';
import { BaseDataJson } from '@api/modules/import/excel-base-data.dto';

@Injectable()
export class ImportService {
  logger: Logger = new Logger(ImportService.name);
  constructor(
    //@Inject(ExcelParserToken)
    private readonly xlsxParser: XlsxParser,
    private readonly repo: BaseDataRepository,
    private readonly preprocessor: EntityPreprocessor,
  ) {}

  async import(fileBuffer: Buffer) {
    let rawBaseData: BaseDataJson[];
    this.logger.log('Excel file import started...');
    try {
      rawBaseData = await this.xlsxParser.parseExcel(fileBuffer);
      const parsedDBEntities = this.preprocessor.toDbEntities({ rawBaseData });
      const savedBaseData = await this.repo.saveBaseData(
        parsedDBEntities.baseData,
      );
      return savedBaseData;
    } catch (e) {
      console.log(e);
    } finally {
    }
  }
}

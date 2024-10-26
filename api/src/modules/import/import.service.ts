import { Inject, Injectable, Logger } from '@nestjs/common';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';
import { ExcelMasterTable } from '@api/modules/import/excel-base-data.dto';
import {
  ExcelParserInterface,
  ExcelParserToken,
} from '@api/modules/import/services/excel-parser.interface';

@Injectable()
export class ImportService {
  logger: Logger = new Logger(ImportService.name);
  constructor(
    @Inject(ExcelParserToken)
    private readonly excelParser: ExcelParserInterface,
    private readonly repo: BaseDataRepository,
    private readonly preprocessor: EntityPreprocessor,
  ) {}

  // TODO: Register import events via event bus
  //       handle updates
  async import(fileBuffer: Buffer) {
    //let rawBaseData: ExcelMasterTable[];
    this.logger.warn('Excel file import started...');
    try {
      const parsedSheets = await this.excelParser.parseExcel(fileBuffer);
      // const parsedDBEntities = this.preprocessor.toDbEntities({ rawBaseData });
      // const savedBaseData = await this.repo.saveBaseData(
      //   parsedDBEntities.baseData,
      // );
      // this.logger.warn('Excel file import completed successfully');
      // // TODO: We don't really need to return the saved data here, but current convenience we will leave it
      return parsedSheets;
    } catch (e) {
      this.logger.error('Excel file import failed', e);
    } finally {
    }
  }
}

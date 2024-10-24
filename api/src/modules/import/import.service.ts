import { Inject, Injectable, Logger } from '@nestjs/common';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';
import {
  ExcelParserInterface,
  ExcelParserToken,
} from '@api/modules/import/services/excel-parser.interface';
import { DataSource } from 'typeorm';
import { Country } from '@shared/entities/country.entity';

@Injectable()
export class ImportService {
  logger: Logger = new Logger(ImportService.name);
  constructor(
    //@Inject(ExcelParserToken)
    private readonly xlsxParser: XlsxParser,
    private readonly repo: BaseDataRepository,
    private readonly dataSource: DataSource,
    private readonly preprocessor: EntityPreprocessor,
  ) {}

  async import(fileBuffer: Buffer) {
    let data;
    this.logger.log('Excel file import started...');
    try {
      data = await this.xlsxParser.parseExcel(fileBuffer);
      const dbEntities = this.preprocessor.toDbEntities(data);
      const savedCountries = await this.dataSource
        .getRepository(Country)
        .save(dbEntities.countries);

      const dbResult = [];
      return savedCountries;
    } catch (e) {
      console.log(e);
    } finally {
    }
  }
}

import { Injectable } from '@nestjs/common';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import { BaseDataRepository } from '@api/modules/model/base-data.repository';

@Injectable()
export class ImportService {
  constructor(
    private readonly xlsxParser: XlsxParser,
    private readonly repo: BaseDataRepository,
    private readonly preprocessor: EntityPreprocessor,
  ) {}

  async import(file: Express.Multer.File) {
    let data;
    try {
      data = await this.xlsxParser.parseExcel<any>(file.buffer);
      const dbEntities = this.preprocessor.toDbEntities(data);

      const dbResult = await this.repo.insertData(dbEntities);
      return dbResult;
    } catch (e) {
      console.log(e);
    } finally {
    }
  }
}

import { Injectable } from '@nestjs/common';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { BaseDataRepository } from '@api/modules/data/ecosystem-data.repository';
import { BaseData } from '@api/modules/data/ecosystem-data.entity';

@Injectable()
export class ImportService {
  constructor(
    private readonly xlsxParser: XlsxParser,
    private readonly repo: BaseDataRepository,
  ) {}

  async import(file: Express.Multer.File) {
    let data;
    try {
      data = data = await this.xlsxParser.parseExcel<BaseData>(file.buffer);
      await this.repo.insertData(data);
    } catch (e) {
      console.log(e);
    } finally {
      return data;
    }
  }
}

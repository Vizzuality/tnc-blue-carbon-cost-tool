import { Injectable } from '@nestjs/common';
import { XlsxParser } from '@api/modules/import/services/xlsx.parser';
import { Country } from '@shared/entities/countries/country.entity';
import { BaseDataRepository } from '@api/modules/base-data/base-data.repository';

@Injectable()
export class ImportService {
  constructor(
    private readonly xlsxParser: XlsxParser,
    private readonly repo: BaseDataRepository,
  ) {}

  async import(file: Express.Multer.File) {
    let data;
    try {
      data = await this.xlsxParser.parseExcel<any>(file.buffer);
      await this.repo.insertData2(data);
    } catch (e) {
      console.log(e);
    } finally {
      return data;
    }
  }
}

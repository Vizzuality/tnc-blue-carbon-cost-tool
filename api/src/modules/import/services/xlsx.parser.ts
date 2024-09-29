import { Injectable } from '@nestjs/common';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { ExcelParserInterface } from './excel-parser.interface';

@Injectable()
export class XlsxParser implements ExcelParserInterface {
  async parseExcel<T>(buffer: Buffer): Promise<T[]> {
    const workbook: WorkBook = read(buffer);
    const sheet: WorkSheet = workbook.Sheets['master_table'];
    const data: T[] = utils.sheet_to_json(sheet, {
      raw: true,
      defval: null,
    });
    return data.map((row) => this.handleCrap<T>(row));
  }

  // TODO: temporal hack to handle stuff, there are values that are No data that could be null in the excel, and missing values like country code or continent
  //       double check the entity to update it

  private handleCrap<T>(row: T): T {
    return Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        value === 'No data'
          ? null
          : typeof value === 'string' && !isNaN(Number(value))
            ? Number(value)
            : value,
      ]),
    ) as T;
  }
}

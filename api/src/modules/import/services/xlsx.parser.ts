import { ExcelParserInterface } from '@api/modules/import/services/excel-parser.interface';
import { Injectable } from '@nestjs/common';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

@Injectable()
export class XlsxParser implements ExcelParserInterface {
  async parseExcel(buffer: Buffer): Promise<any> {
    const workbook: WorkBook = read(buffer);
    const sheet: WorkSheet = workbook.Sheets['master_table'];
    const data: any[] = utils.sheet_to_json(sheet, { raw: true, defval: null });
    return data;
  }
}

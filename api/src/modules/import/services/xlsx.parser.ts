import { Injectable } from '@nestjs/common';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { ExcelParserInterface } from './excel-parser.interface';

@Injectable()
export class XlsxParser implements ExcelParserInterface {
  async parseExcel<T>(buffer: Buffer): Promise<any> {
    const workbook: WorkBook = read(buffer);
    let result;

    // const result: ExcelToDbMapDTO = {} as ExcelToDbMapDTO;
    //
    // for (const sheetName of SHEETS_TO_PARSE) {
    //   const sheet: WorkSheet = workbook.Sheets[sheetName];
    //   const data = utils.sheet_to_json(sheet, {
    //     raw: true,
    //   });
    //   result[sheetName] = data;
    // }

    return result;
  }
}

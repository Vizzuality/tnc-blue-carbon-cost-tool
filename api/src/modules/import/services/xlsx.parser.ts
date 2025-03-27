import { Injectable } from '@nestjs/common';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import {
  ExcelParserInterface,
  SHEETS_TO_PARSE,
} from './excel-parser.interface';

@Injectable()
export class XlsxParser implements ExcelParserInterface {
  async parseExcel(buffer: Buffer) {
    const workbook: WorkBook = read(buffer);
    const parsedData: any = {};

    for (const sheetName of SHEETS_TO_PARSE) {
      const sheet: WorkSheet = workbook.Sheets[sheetName];
      const parsedSheet = utils.sheet_to_json(sheet, {
        raw: true,
      });
      parsedData[sheetName] = parsedSheet;
    }

    return parsedData;
  }
}

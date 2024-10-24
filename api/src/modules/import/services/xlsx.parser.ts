import { Injectable } from '@nestjs/common';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import {
  ExcelParserInterface,
  SHEETS_TO_PARSE,
} from './excel-parser.interface';
import { BaseDataJson } from '@api/modules/import/excel-base-data.dto';

@Injectable()
export class XlsxParser implements ExcelParserInterface {
  async parseExcel(buffer: Buffer): Promise<BaseDataJson[]> {
    const workbook: WorkBook = read(buffer);
    let parsedData: BaseDataJson[];

    for (const sheetName of SHEETS_TO_PARSE) {
      const sheet: WorkSheet = workbook.Sheets[sheetName];
      parsedData = utils.sheet_to_json(sheet, {
        raw: true,
      });
    }

    return parsedData;
  }
}

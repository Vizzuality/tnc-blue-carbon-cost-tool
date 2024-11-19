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

  async parseUserExcels(data: Buffer[]) {
    const carbonInputs: WorkBook = read(data[0]);
    const costInputs: WorkBook = read(data[1]);
    const CARBON_INPUTS_SHEETS = ['Restoration', 'Conservation'];
    const COST_INPUTS_SHEETS = ['Input'];
    const parsedCarbonInputs: any = {};
    let parsedCostInputs: WorkSheet;
    //
    // for (const sheetName of CARBON_INPUTS_SHEETS) {
    //   const sheet: WorkSheet = carbonInputs.Sheets[sheetName];
    //   const parsedSheet = utils.sheet_to_json(sheet, {
    //     raw: true,
    //   });
    //   parsedCarbonInputs[sheetName] = parsedSheet;
    // }

    for (const sheetName of COST_INPUTS_SHEETS) {
      parsedCostInputs = costInputs.Sheets[sheetName];
      //= utils.sheet_to_json(sheet, { header: 4 });
      //parsedCostInputs[sheetName] = parsedSheet;
    }
    const result: Record<string, string> = {};
    const keysToIgnore = [
      'Input data into blue shade cells',
      'General information',
      'Project information',
    ];

    Object.keys(parsedCostInputs).forEach((cellKey) => {
      if (!cellKey.startsWith('B')) return; // Ignore cells that are not in column B

      const questionCell = parsedCostInputs[cellKey];
      const question = questionCell?.v;

      if (question && !keysToIgnore.includes(question)) {
        // Answer is in the column C or D of the same row
        const rowIndex = cellKey.match(/\d+/)?.[0]; // extract row number from cell key
        const answerCellKey = `C${rowIndex}`;
        const answerCell =
          parsedCostInputs[answerCellKey] || parsedCostInputs[`D${rowIndex}`];

        const answer = answerCell?.v || 'No value provided';
        result[question] = answer;
      }
    });

    return {
      //carbonInputs: parsedCarbonInputs,
      costInputs: result,
    };
  }
}

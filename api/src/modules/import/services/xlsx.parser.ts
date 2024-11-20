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

    const restorationSheet: WorkSheet = carbonInputs.Sheets['Restoration'];
    const conservationSheet: WorkSheet = carbonInputs.Sheets['Conservation'];
    const restoration = parseRestorationSheet(restorationSheet);
    const costInputSheet = costInputs.Sheets['Input'];
    const conservation = parseConservationSheet(conservationSheet);

    const costInput: Record<string, string> = {};
    const keysToIgnore = [
      'Input data into blue shade cells',
      'General information',
      'Project information',
    ];

    Object.keys(costInputSheet).forEach((cellKey) => {
      if (!cellKey.startsWith('B')) return; // Ignore cells that are not in column B

      const questionCell = costInputSheet[cellKey];
      const question = questionCell?.v;

      if (question && !keysToIgnore.includes(question)) {
        // Answer is in the column C or D of the same row
        const rowIndex = cellKey.match(/\d+/)?.[0]; // extract row number from cell key
        const answerCellKey = `C${rowIndex}`;
        const answerCell =
          costInputSheet[answerCellKey] || costInputSheet[`D${rowIndex}`];

        const answer = answerCell?.v || 'No value provided';
        costInput[question] = answer;
      }
    });

    return {
      carbonInputs: { restoration, conservation },
      costInputs: costInput,
    };
  }
}

function parseRestorationSheet(sheet: WorkSheet): Record<string, any> {
  const result: Record<string, any> = {};

  const keysToIgnore = [
    'Sub-national / project sequestration information',
    'General information',
  ];

  Object.keys(sheet).forEach((cellKey) => {
    if (!cellKey.startsWith('B')) return;

    const questionCell = sheet[cellKey];
    const question = questionCell?.v;

    if (question && !keysToIgnore.includes(question)) {
      const rowIndex = cellKey.match(/\d+/)?.[0];
      const answerCellKey = `C${rowIndex}`;
      const answerCell = sheet[answerCellKey];

      const answer = answerCell?.v || 'No value provided';
      result[question] = answer;
    }
  });

  return result;
}

function parseConservationSheet(sheet: WorkSheet): Record<string, any> {
  const result: Record<string, any> = {};

  const keysToIgnore = [
    'Sub-national / project sequestration information',
    'General information',
  ];

  Object.keys(sheet).forEach((cellKey) => {
    if (!cellKey.startsWith('B')) return;

    const questionCell = sheet[cellKey];
    const question = questionCell?.v;

    if (question && !keysToIgnore.includes(question)) {
      const rowIndex = cellKey.match(/\d+/)?.[0];
      const answerCellKey = `C${rowIndex}`;
      const answerCell = sheet[answerCellKey];

      const answer = answerCell?.v || 'No value provided';
      result[question] = answer;
    }
  });

  return result;
}

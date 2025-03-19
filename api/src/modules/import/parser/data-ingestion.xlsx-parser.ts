import { RawDataIngestionData } from '@api/modules/import/parser/raw-data-ingestion.type';
import {
  ExcelTabHeaderNotFoundError,
  ExcelTabNotFoundError,
  IExcelParser,
} from '@api/modules/import/parser/excel-parser.interface';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { DATA_INGESTION_CONFIG } from '@api/modules/import/parser/data-ingestion.config';

export class DataIngestionExcelParser implements IExcelParser {
  public async parseBuffer(buffer: Buffer): Promise<RawDataIngestionData> {
    const excelFile: WorkBook = read(buffer);
    const parsedData: Partial<RawDataIngestionData> = {};

    const expectedTabNames = Object.keys(DATA_INGESTION_CONFIG);
    for (const tabName of expectedTabNames) {
      const tabContents: WorkSheet = excelFile.Sheets[tabName];
      if (tabContents === undefined) {
        throw new ExcelTabNotFoundError(tabName);
      }

      const tabHeaders = (
        utils.sheet_to_json(tabContents, {
          header: 1,
          raw: true,
        })[0] as string[]
      ).map((header: string) => header.trim());
      const tabConfig = DATA_INGESTION_CONFIG[tabName];
      if (Array.isArray(tabConfig.expected)) {
        for (const column of tabConfig.expectedColumns) {
          if (tabHeaders.includes(column) === false) {
            throw new ExcelTabHeaderNotFoundError(column, tabName);
          }
        }
      }

      const parsedTab = utils
        .sheet_to_json(tabContents, {
          header: tabHeaders,
          range: 1,
          raw: true,
        })
        .map((row) => {
          Object.keys(row).forEach((key) => {
            // Fix for the NaN values produced by the excel with "NoData" values
            if (row[key] === 'NoData') {
              row[key] = undefined;
            }
          });
          return row;
        });

      parsedData[tabName] = parsedTab;
    }

    return parsedData as RawDataIngestionData;
  }
}

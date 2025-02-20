import { RawDataIngestionData } from '@api/modules/import/parser/raw-data-ingestion.type';
import {
  ExcelTabHeaderNotFoundError,
  ExcelTabNotFoundError,
  IExcelParser,
} from '@api/modules/import/parser/excel-parser.interface';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { DATA_INGESTION_CONFIG } from '@api/modules/import/parser/data-ingestion.config';

export const EXPECTED_SHEETS = [
  'Index',
  'Sheet20',
  'Pivot Table 1',
  'Model assumptions and constrain',
  'Backoffice',
  'Input',
  // 'Model assumptions',
  'Data pull',
  'Data ingestion >>>',
  'master_table',
  'base_size_table',
  'base_increase',
  'Projects',
  'Base inputs>>>',
  'Countries',
  'Ecosystem',
  'Activity',
  'Restoration_activity',
  'Cost inputs>>',
  'Project size',
  'Feasibility analysis',
  'Conservation planning and admin',
  'Data collection and field costs',
  'Community representation',
  'Blue carbon project planning',
  'Establishing carbon rights',
  'Financing cost',
  'Validation',
  'Implementation labor',
  'Monitoring',
  'Maintenance',
  'Community benefit sharing fund',
  'Baseline reassessment',
  'MRV',
  'Long-term project operating',
  'Carbon standard fees',
  'Community cash flow',
  'Carbon inputs>>',
  'Ecosystem extent',
  'Ecosystem loss',
  'Restorable land',
  'Sequestration rate',
  'Emission factors',
  'Mapping references>>',
  'Continent',
  'HDI',
  'Abbreviation',
  'Sources>>',
  'Sequestration rates',
  'Emissions sources',
  'MangroveEmissionsValues',
  'Loss rates & restorable land',
  'Datasets>>',
  'Mangrove extent',
  'Mangrove protected area',
  'Seagrass extent',
  'Salt marsh extent',
  'Mangrove restorable land',
] as const;

export class DataIngestionExcelParser implements IExcelParser {
  public async parseBuffer(
    buffer: Buffer,
    oldFileBuffer: Buffer,
  ): Promise<RawDataIngestionData> {
    const excelFile: WorkBook = read(buffer);
    const parsedData: Partial<RawDataIngestionData> = {};

    const expectedTabNames = Object.keys(DATA_INGESTION_CONFIG);
    for (const tabName of expectedTabNames) {
      const tabContents: WorkSheet = excelFile.Sheets[tabName];
      if (tabContents === undefined) {
        throw new ExcelTabNotFoundError(tabName);
      }

      const parsedTab = utils.sheet_to_json(tabContents, {
        raw: true,
      });

      const tabConfig = DATA_INGESTION_CONFIG[tabName];
      const firstRow: Record<string, unknown> = parsedTab[0] as Record<
        string,
        unknown
      >;
      for (const column of tabConfig.expectedColumns) {
        if (!(column in firstRow)) {
          throw new ExcelTabHeaderNotFoundError(column, tabName);
        }
        console.log(parsedTab);
        parsedData[tabName] = parsedTab;
      }

      // Legacy code kept for the incremental migration of the data ingestion parser.
      const workbook: WorkBook = read(oldFileBuffer);
      for (const sheetName of EXPECTED_SHEETS) {
        const sheet: WorkSheet = workbook.Sheets[sheetName];
        if (sheet === undefined) {
          throw new ExcelTabNotFoundError(sheetName);
        }

        // We make sure headers are trimmed.
        // We cannot see the space preceding the tab heading if we open the file using google sheets, excel online or numbers on mac.
        // Quick localized fix that only applies to the 'Implementation labor' tab in order to avoid potential issues with other tabs.
        if (sheetName === 'Implementation labor') {
          const tabHeaders = (
            utils.sheet_to_json(sheet, { header: 1, raw: true })[0] as string[]
          ).map((header: any) => header.trim());

          const parsedSheet = utils.sheet_to_json(sheet, {
            header: tabHeaders,
            range: 1,
            raw: true,
          });
          parsedData[sheetName] = parsedSheet as any;
          continue;
        }

        const parsedSheet = utils.sheet_to_json(sheet, {
          raw: true,
        });
        // We can validate the sheet tab headers and column values when we have more information from the science team.
        parsedData[sheetName] = parsedSheet;
      }

      return parsedData as RawDataIngestionData;
    }
  }
}

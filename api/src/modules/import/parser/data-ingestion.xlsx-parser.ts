import { RawDataIngestionData } from '@api/modules/import/parser/raw-data-ingestion.type';
import {
  ExcelTabNotFoundError,
  IExcelParser,
} from '@api/modules/import/parser/excel-parser.interface';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

export const EXPECTED_SHEETS = [
  'Index',
  'Sheet20',
  'Pivot Table 1',
  'Model assumptions and constrain',
  'Backoffice',
  'Input',
  'Model assumptions',
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
  public async parseBuffer(buffer: Buffer): Promise<RawDataIngestionData> {
    const workbook: WorkBook = read(buffer);
    const parsedData: any = {};

    for (const sheetName of EXPECTED_SHEETS) {
      const sheet: WorkSheet = workbook.Sheets[sheetName];
      if (sheet === undefined) {
        throw new ExcelTabNotFoundError(sheetName);
      }

      const parsedSheet = utils.sheet_to_json(sheet, {
        raw: true,
      });
      // We can validate the sheet tab headers and column values when we have more information from the science team.
      parsedData[sheetName] = parsedSheet;
    }

    return parsedData;
  }
}

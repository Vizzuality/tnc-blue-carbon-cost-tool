export const ExcelParserToken = Symbol('ExcelParserInterface');
import exel_to_entity_map from '@shared/excel_to_entity_map.json';

export const SHEETS_TO_PARSE = ['master_table', 'Countries'];

export type ExcelType = typeof exel_to_entity_map;

export interface ExcelParserInterface {
  parseExcel(data: Buffer): Promise<any>;
}

export const ExcelParserToken = Symbol('ExcelParserInterface');
export const SHEETS_TO_PARSE = ['master_table', 'Projects'] as const;

export interface ExcelParserInterface {
  parseExcel(data: Buffer): Promise<any>;
}

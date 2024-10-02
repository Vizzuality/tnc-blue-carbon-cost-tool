export const ExcelParserToken = Symbol('ExcelParserInterface');

export interface ExcelParserInterface {
  parseExcel(data: Buffer): Promise<any>;
}

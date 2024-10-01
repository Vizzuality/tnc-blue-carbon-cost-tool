export const ExcelParserToken = Symbol('ExcelParserInterface');

export const EXCEL_TO_DB_MAP = {
  'Country Code': 'code',
  'Country Name': 'country',
  Continent: 'continent',
  'Region 1': 'region1',
  'Region 2': 'region2',
  'Numeric Code': 'numericCode',
  HDI: 'hdi',
};

export interface ExcelParserInterface {
  parseExcel(data: Buffer): Promise<any>;
}

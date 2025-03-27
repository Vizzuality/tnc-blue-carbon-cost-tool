export const ExcelParserToken = Symbol('ExcelParserInterface');
export const SHEETS_TO_PARSE = [
  'master_table',
  'Projects',
  'Project size',
  'Feasibility analysis',
  'Conservation planning and admin',
  'Data collection and field costs',
  'Community representation',
  'Blue carbon project planning',
  'Establishing carbon rights',
  'Financing cost',
  'Validation',
  'Monitoring',
  'Maintenance',
  'Community benefit sharing fund',
  'Baseline reassessment',
  'MRV',
  'Long-term project operating',
  'Carbon standard fees',
  'Community cash flow',
  'Ecosystem extent',
  'Ecosystem loss',
  'Restorable land',
  'Sequestration rate',
  'Emission factors',
  'Implementation labor',
  'base_size_table',
  'base_increase',
  'Model assumptions',
  'Data_ingestion',
] as const;

export interface ExcelParserInterface {
  parseExcel(data: Buffer): Promise<any>;
}

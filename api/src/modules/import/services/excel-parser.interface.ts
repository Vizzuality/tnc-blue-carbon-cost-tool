export interface ExcelParserInterface {
  parseExcel(file: Express.Multer.File): Promise<any>;
}

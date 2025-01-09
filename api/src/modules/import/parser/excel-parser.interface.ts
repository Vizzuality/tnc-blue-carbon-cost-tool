export class ExcelTabNotFoundError extends Error {
  constructor(tabName: string) {
    super(`Tab ${tabName} not found in the excel file`);
  }
}

export class ExcelTabHeaderNotFoundError extends Error {
  constructor(header: string, tabName: string) {
    super(`Header (${header}) not found in the tab ${tabName}`);
  }
}

export class RowColumnInvalidError extends Error {
  constructor(row: number, column: string) {
    super(`Invalid value in row ${row} and column ${column}`);
  }
}

export interface IExcelParser {
  parseBuffer(buffer: Buffer): Promise<unknown>;
}

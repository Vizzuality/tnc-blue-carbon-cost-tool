import { IMPORT_CONFIG } from '@api/modules/import/import.config';
import { ExcelTabNotFoundError } from '@api/modules/import/parser/excel-parser.interface';
import {
  UPLOAD_DATA_FILE_KEYS,
  UploadDataFilesDto,
} from '@shared/dtos/users/upload-data-files.dto';
import { read, WorkBook, WorkSheet } from 'xlsx';
import { ZodError, ZodIssue } from 'zod';

export class UserXlsxTemplatesParser {
  public async parse(files: UploadDataFilesDto) {
    const result: {
      carbonInputs?: any;
      costInputs?: any;
    } = {};

    const carbonInputsTemplate =
      files[UPLOAD_DATA_FILE_KEYS.CARBON_INPUTS_TEMPLATE];
    const costInputsTemplate =
      files[UPLOAD_DATA_FILE_KEYS.COST_INPUTS_TEMPLATE];

    const parseIssues: ZodIssue[] = [];
    if (carbonInputsTemplate != null) {
      const carbonInputs: WorkBook = read(carbonInputsTemplate.buffer);
      const config =
        IMPORT_CONFIG[UPLOAD_DATA_FILE_KEYS.CARBON_INPUTS_TEMPLATE];
      result.carbonInputs = {};

      for (const tab of config.expectedTabs) {
        const tabData: WorkSheet = carbonInputs.Sheets[tab.name];
        if (tabData == null) throw new ExcelTabNotFoundError(tab.name);

        result.carbonInputs[tab.name] = {};
        for (const field of tab.expectedFields) {
          const value = tabData[field.dataPosition]?.v;
          if (field.validation !== undefined) {
            const validationRes = field.validation.safeParse(value);
            if (validationRes.success === false) {
              const issues = validationRes.error.issues.map(
                (issue) =>
                  ({
                    ...issue,
                    path: [
                      UPLOAD_DATA_FILE_KEYS.CARBON_INPUTS_TEMPLATE,
                      tab.name,
                      field.name,
                    ],
                  }) as ZodIssue,
              );
              parseIssues.push(...issues);
              continue;
            }
            result.carbonInputs[tab.name][field.name] = value;
          }
        }
      }
    }

    if (costInputsTemplate != null) {
      const costInputs: WorkBook = read(costInputsTemplate.buffer);
      const config = IMPORT_CONFIG[UPLOAD_DATA_FILE_KEYS.COST_INPUTS_TEMPLATE];
      result.costInputs = {};

      for (const tab of config.expectedTabs) {
        const tabData: WorkSheet = costInputs.Sheets[tab.name];
        if (tabData == null) throw new ExcelTabNotFoundError(tab.name);

        result.costInputs[tab.name] = {};
        for (const field of tab.expectedFields) {
          const value = tabData[field.dataPosition]?.v;
          if (field.validation !== undefined) {
            const validationRes = field.validation.safeParse(value);
            if (validationRes.success === false) {
              const issues = validationRes.error.issues.map(
                (issue) =>
                  ({
                    ...issue,
                    path: [
                      UPLOAD_DATA_FILE_KEYS.COST_INPUTS_TEMPLATE,
                      tab.name,
                      field.name,
                    ],
                  }) as ZodIssue,
              );
              parseIssues.push(...issues);
              continue;
            }
            result.costInputs[tab.name][field.name] = value;
          }
        }
      }
    }

    if (parseIssues.length > 0) {
      throw new ZodError(parseIssues);
    }

    return result;
  }
}

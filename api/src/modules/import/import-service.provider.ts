import { ImportService } from '@api/modules/import/import.service';
import { TestImportService } from '../../../test/utils/mocks/test-import.service';
import * as process from 'node:process';

const classToUse =
  process.env.NODE_ENV === 'test' ? TestImportService : ImportService;

export const ImportServiceProvider = {
  provide: ImportService,
  useClass: classToUse,
};

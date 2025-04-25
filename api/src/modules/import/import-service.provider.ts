import { ImportService } from '@api/modules/import/import.service';
import { TestImportService } from '../../../test/utils/mocks/test-import.service';
import * as process from 'node:process';

/**
 * @description: Custom provider to inject the testing import service (temporarily) this is required for e2e tests, because
 *               for API tests, we can use the testing module to override the service, but for e2e tests this is not possible,
 *                so that we need to inject a custom one if node_env is test, as it is injected before running the backend in e2e tests
 *
 *                Additionally, since the compute projects at import is not finished but its getting too big, we are using a flag to
 *                enable it only for local dev and testing, we need to remove it once the feature is finished
 */

const FLAG_USE_COMPUTE_PROJECT_AT_IMPORT =
  process.env.API_USE_COMPUTE_PROJECT_AT_IMPORT === 'true';

console.log(
  'FLAG_USE_COMPUTE_PROJECT_AT_IMPORT',
  process.env.API_USE_COMPUTE_PROJECT_AT_IMPORT,
);

const classToUse =
  !FLAG_USE_COMPUTE_PROJECT_AT_IMPORT || process.env.NODE_ENV === 'test'
    ? TestImportService
    : ImportService;

export const ImportServiceProvider = {
  provide: ImportService,
  useClass: classToUse,
};

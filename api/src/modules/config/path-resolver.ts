import { join } from 'path';

// TODO: Workaround: This should be prob fixed in the jest conf

const TEST_RELATIVE_PATH = '../../../../';
const DEFAULT_RELATIVE_PATH = '../../../../../../';

/**
 * @description: Resolve the path of the dotenv config file relative to shared folder
 */
export function resolveConfigPath(relativePath: string): string {
  const rootDir = DEFAULT_RELATIVE_PATH;
  return join(__dirname, rootDir, relativePath);
}

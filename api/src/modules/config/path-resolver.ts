import { join } from 'path';

// TODO: Workaround: This should be prob fixed in the jest conf

const TEST_RELATIVE_PATH = '../../../../';
const DEFAULT_RELATIVE_PATH = '../../../../../../';

/**
 * @description: Resolve the path of the config file depending on the environment
 */
export function resolveConfigPath(relativePath: string): string {
  const rootDir =
    process.env.NODE_ENV === 'test'
      ? TEST_RELATIVE_PATH
      : DEFAULT_RELATIVE_PATH;
  return join(__dirname, rootDir, relativePath);
}

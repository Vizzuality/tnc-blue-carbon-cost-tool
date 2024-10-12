import { join } from 'path';

const DEFAULT_RELATIVE_PATH = '../../../../../../';

/**
 * @description: Resolve the path of the dotenv config file relative to shared folder
 */
export function resolveConfigPath(relativePath: string): string {
  const rootDir = DEFAULT_RELATIVE_PATH;
  return join(__dirname, rootDir, relativePath);
}

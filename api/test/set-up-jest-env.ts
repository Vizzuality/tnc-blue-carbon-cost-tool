import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * @description: Since Jest is executed in a different context, we need to load the environment variables manually for this specific context
 *               for e2e tests, the default route + env suffix is used
 */

const envPath = resolve(__dirname, '../../shared/config/.env.test');

config({ path: envPath });

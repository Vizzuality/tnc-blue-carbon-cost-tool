import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

const envPath = resolve(__dirname, '../../shared/config/.env.test');
config({ path: envPath });

export default async function globalTeardown() {
  const adminDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await adminDataSource.initialize();

  const result = await adminDataSource.query(`
    SELECT datname FROM pg_database WHERE datname LIKE 'test-%';
  `);

  const promises = result.map(async (row) => {
    const dbName = row.datname;
    await adminDataSource.query(`DROP DATABASE "${dbName}" WITH (FORCE);`);
  });
  await Promise.all(promises);
  await await adminDataSource.destroy();
}

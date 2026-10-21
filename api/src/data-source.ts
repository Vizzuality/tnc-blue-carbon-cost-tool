import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { COMMON_DATABASE_ENTITIES } from '@shared/lib/db-entities';

const envFile = (name: string) =>
  resolve(__dirname, `../../shared/config/.env${name}`);

loadEnv({
  path: [
    envFile(process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''),
    envFile(''),
  ],
});

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: requiredEnv('DB_HOST'),
  port: Number(requiredEnv('DB_PORT')),
  username: requiredEnv('DB_USERNAME'),
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_NAME'),
  entities: COMMON_DATABASE_ENTITIES,
  migrations: [resolve(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

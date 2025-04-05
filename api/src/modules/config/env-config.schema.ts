import { z } from 'zod';

const EXPIRES_IN_REGEX = /^[0-9]+\w$/;

const COMPUTATIONS_MICROSERVICE_SCHEMA = z
  .string()
  .url({ message: 'Invalid URL for COMPUTATIONS_MICROSERVICE_URL' })
  .refine(
    (val) => {
      try {
        const url = new URL(val);
        return !!url.port;
      } catch {
        return false;
      }
    },
    {
      message: 'COMPUTATIONS_MICROSERVICE_URL must include a port',
    },
  );

const envConfigSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_NAME: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),

    COMPUTATIONS_MICROSERVICE_URL: COMPUTATIONS_MICROSERVICE_SCHEMA,

    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRES_IN: z.string().regex(EXPIRES_IN_REGEX),

    ACCOUNT_CONFIRMATION_TOKEN_SECRET: z.string(),
    ACCOUNT_CONFIRMATION_EXPIRES_IN: z.string().regex(EXPIRES_IN_REGEX),
    RESET_PASSWORD_TOKEN_SECRET: z.string(),
    RESET_PASSWORD_TOKEN_EXPIRES_IN: z.string().regex(EXPIRES_IN_REGEX),
    EMAIL_CONFIRMATION_TOKEN_SECRET: z.string(),
    EMAIL_CONFIRMATION_TOKEN_EXPIRES_IN: z.string().regex(EXPIRES_IN_REGEX),

    AWS_SES_ACCESS_KEY_ID: z.string(),
    AWS_SES_ACCESS_KEY_SECRET: z.string(),
    AWS_SES_DOMAIN: z.string(),
    AWS_REGION: z.string(),

    BACKOFFICE_SESSION_COOKIE_NAME: z.string(),
    BACKOFFICE_SESSION_COOKIE_SECRET: z.string(),
  })
  .passthrough();

export const validateEnvConfig = (config: Record<string, string>) => {
  return envConfigSchema.parse(config);
};

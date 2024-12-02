import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { DatabaseModule } from '@api/modules/config/database/database.module';
import { resolveConfigPath } from '@api/modules/config/path-resolver';
import { JwtConfigHandler } from '@api/modules/config/auth-config.handler';

@Global()
@Module({
  imports: [
    /**
     * @note: Check if we can abstract the conf to ApiConfigService
     */
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // TODO: This is a bit ugly, we should find a way to make this more elegant
      envFilePath: [
        resolveConfigPath(`shared/config/.env.${process.env.NODE_ENV}`),
        resolveConfigPath(`shared/config/.env`),
      ],
      validate(config) {
        const expectedVariables = [
          'BACKOFFICE_SESSION_COOKIE_NAME',
          'BACKOFFICE_SESSION_COOKIE_SECRET',
        ];

        const missingVariables = [];
        for (const expectedVariable of expectedVariables) {
          if (config[expectedVariable] === undefined) {
            missingVariables.push(expectedVariable);
          }
        }

        if (missingVariables.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missingVariables.join(', ')}`,
          );
        }
        return config;
      },
    }),
    DatabaseModule,
  ],
  providers: [ConfigService, ApiConfigService, JwtConfigHandler],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}

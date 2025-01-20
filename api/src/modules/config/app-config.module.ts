import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { DatabaseModule } from '@api/modules/config/database/database.module';
import { resolveConfigPath } from '@api/modules/config/path-resolver';
import { JwtConfigHandler } from '@api/modules/config/auth-config.handler';
import { validateEnvConfig } from '@api/modules/config/env-config.schema';

@Global()
@Module({
  imports: [
    /**
     * @note: Check if we can abstract the conf to ApiConfigService
     */
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        resolveConfigPath(`shared/config/.env.${process.env.NODE_ENV}`),
        resolveConfigPath(`shared/config/.env`),
      ],
      validate: validateEnvConfig,
    }),
    DatabaseModule,
  ],
  providers: [ConfigService, ApiConfigService, JwtConfigHandler],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}

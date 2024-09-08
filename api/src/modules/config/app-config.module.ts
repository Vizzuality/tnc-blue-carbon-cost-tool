import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { DatabaseModule } from '@api/modules/config/database/database.module';
import { resolveConfigPath } from '@api/modules/config/path-resolver';

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
    }),
    DatabaseModule,
  ],
  providers: [ConfigService, ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}

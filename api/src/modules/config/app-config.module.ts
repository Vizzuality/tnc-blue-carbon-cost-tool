import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { DatabaseModule } from '@api/modules/config/database/database.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    /**
     * @note: Check if we can abstract the conf to ApiConfigService
     */
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // TODO: This is a bit ugly, we should find a way to make this more elegant
      envFilePath: [
        join(
          __dirname,
          `../../../../../../shared/config/.env.${process.env.NODE_ENV}`,
        ),
        join(__dirname, '../../../../../../shared/config/.env'),
      ],
    }),
  ],
  providers: [ConfigService, ApiConfigService],
  exports: [ApiConfigService, DatabaseModule],
})
export class ApiConfigModule {}

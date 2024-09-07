import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '@api/modules/config/app-config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [forwardRef(() => ApiConfigModule)],

      useFactory: (config: ApiConfigService) => ({
        ...config.getDatabaseConfig(),
        type: 'postgres',
      }),
      inject: [ApiConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

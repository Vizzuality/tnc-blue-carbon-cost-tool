import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from '@api/modules/config/app-config.module';
import { AuthModule } from '@api/modules/auth/auth.module';
import { NotificationsModule } from '@api/modules/notifications/notifications.module';
import { AdminModule } from '@api/modules/admin/admin.module';
import { ImportModule } from '@api/modules/import/import.module';
import { ApiEventsModule } from '@api/modules/api-events/api-events.module';
import { UsersModule } from '@api/modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@api/filters/all-exceptions.exception.filter';
import { TsRestModule } from '@ts-rest/nest';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    TsRestModule.register({
      validateRequestQuery: true,
      validateRequestBody: true,
      isGlobal: true,
      validateRequestHeaders: false,
    }),
    ApiConfigModule,
    AuthModule,
    NotificationsModule,
    ApiEventsModule,
    AdminModule,
    ImportModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private datasource: DataSource) {}

  async onModuleInit() {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      const countries = await queryRunner.query(
        'SELECT count(*) FROM countries',
      );
      if (countries[0].count > 0) {
        return;
      }

      const isTestEnv = process.env.NODE_ENV === 'test';

      const sqlFilePath = isTestEnv
        ? path.join(__dirname, '../src/geocountries.sql')
        : path.join(__dirname, '../../../src/geocountries.sql');

      const sql = fs.readFileSync(sqlFilePath, 'utf8');

      await queryRunner.query(sql);
      console.warn('Countries imported');
    } catch (e) {
      console.error('Error while importing countries', e);
    } finally {
      await queryRunner.release();
    }
  }
}

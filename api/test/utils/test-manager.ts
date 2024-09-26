import { AppModule } from '@api/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { logUserIn } from './user.auth';
import { Type } from '@nestjs/common/interfaces';
import * as request from 'supertest';

import { getDataSourceToken } from '@nestjs/typeorm';
import { clearTestDataFromDatabase } from './db-helpers';
import { createUser } from './mocks/entity-mocks';
import { User } from '@shared/entities/users/user.entity';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { MockEmailService } from './mocks/mock-email.service';
import { ROLES } from '@api/modules/auth/roles.enum';

/**
 * @description: Abstraction for NestJS testing workflow. For now its a basic implementation to create a test app, but can be extended to encapsulate
 * common testing utilities
 */

export class TestManager {
  testApp: INestApplication;
  dataSource: DataSource;
  moduleFixture: TestingModule;
  constructor(
    testApp: INestApplication,
    dataSource: DataSource,
    moduleFixture: TestingModule,
  ) {
    this.testApp = testApp;
    this.dataSource = dataSource;
    this.moduleFixture = moduleFixture;
  }

  static async createTestManager() {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IEmailServiceToken)
      .useClass(MockEmailService)
      .compile();
    const dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    const testApp = moduleFixture.createNestApplication();
    // TODO: Add global validation or App level Zod when decided what to use
    //testApp.useGlobalPipes(new ValidationPipe());
    await testApp.init();
    return new TestManager(testApp, dataSource, moduleFixture);
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  getApp() {
    return this.testApp;
  }

  getDataSource() {
    return this.dataSource;
  }

  close() {
    return this.testApp.close();
  }

  getModule<TInput = any, TResult = TInput>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    typeOrToken: Type<TInput> | Function | string | symbol,
  ): TResult {
    return this.moduleFixture.get(typeOrToken);
  }

  async setUpTestUser() {
    const user = await createUser(this.getDataSource(), {
      role: ROLES.ADMIN,
      isActive: true,
    });
    return logUserIn(this, user);
  }

  async logUserIn(user: Partial<User>) {
    return logUserIn(this, user);
  }

  request() {
    return request(this.testApp.getHttpServer());
  }

  mocks() {
    return {
      createUser: (additionalData?: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
    };
  }
}

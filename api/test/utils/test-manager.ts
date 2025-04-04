import { AppModule } from '@api/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { logUserIn } from './user.auth';
import { Type } from '@nestjs/common/interfaces';
import * as request from 'supertest';

import { getDataSourceToken } from '@nestjs/typeorm';
import { User } from '@shared/entities/users/user.entity';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { MockEmailService } from './mocks/mock-email.service';
import { ROLES } from '@shared/entities/users/roles.enum';

import {
  createProject,
  createUser,
  createProjectScorecard,
  createCustomProject,
} from '@shared/lib/entity-mocks';
import {
  clearTablesByEntities,
  clearTestDataFromDatabase,
} from '@shared/lib/db-helpers';

import * as path from 'path';
import * as fs from 'fs';
import { Project } from '@shared/entities/projects.entity';
import { adminContract } from '@shared/contracts/admin.contract';
import { Country } from '@shared/entities/country.entity';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { ImportService } from '@api/modules/import/import.service';
import { TestImportService } from './mocks/test-import.service';
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

  static async createTestManager(options: { logger?: Logger | false } = {}) {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IEmailServiceToken)
      .useClass(MockEmailService)
      .overrideProvider(ImportService)
      .useClass(TestImportService)
      .compile();
    const dataSource = moduleFixture.get<DataSource>(getDataSourceToken());
    const testApp = moduleFixture.createNestApplication();
    if (options.logger !== undefined) {
      // Has to be called before init. Otherwise it has no effect.
      testApp.useLogger(options.logger);
    }
    // TODO: Add global validation or App level Zod when decided what to use
    //testApp.useGlobalPipes(new ValidationPipe());
    await testApp.init();
    return new TestManager(testApp, dataSource, moduleFixture);
  }

  async clearDatabase() {
    await clearTestDataFromDatabase(this.dataSource);
  }

  async clearTablesByEntities(entities: any[]) {
    return clearTablesByEntities(this.dataSource, entities);
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
    return request(this.getApp().getHttpServer());
  }

  async ingestCountries() {
    const geoCountriesFilePath = path.join(
      __dirname,
      '../../../api/src/insert_countries.sql',
    );
    const geoCountriesSql = fs.readFileSync(geoCountriesFilePath, 'utf8');
    await this.dataSource.query(geoCountriesSql);
    await this.dataSource.query(
      'UPDATE countries SET area_ha = ST_Area(geography(geometry)) / 10000;',
    );
  }

  async ingestProjectScoreCards(jwtToken: string) {
    const countriesPresent = await this.dataSource
      .getRepository(Country)
      .find();
    if (!countriesPresent.length) {
      throw new Error(
        'No Countries present in the DB, cannot ingest Excel data for tests',
      );
    }
    const testFilePath = path.join(
      __dirname,
      '../../../data/excel/data_ingestion_project_scorecard.xlsm',
    );
    const fileBuffer = fs.readFileSync(testFilePath);
    const upload = await this.request()
      .post(adminContract.uploadProjectScorecard.path)
      .set('Authorization', `Bearer ${jwtToken}`)
      .attach('file', fileBuffer, 'data_ingestion_project_scorecard.xlsm');
    if (upload.status !== 201) {
      throw new Error(
        'Failed to upload data_ingestion_project_scorecard.xlsm file for tests',
      );
    }
  }

  async ingestExcel(jwtToken: string) {
    const countriesPresent = await this.dataSource
      .getRepository(Country)
      .find();
    if (!countriesPresent.length) {
      throw new Error(
        'No Countries present in the DB, cannot ingest Excel data for tests',
      );
    }
    const testFilePath = path.join(
      __dirname,
      '../../../data/excel/Carbon-Cost Data Upload.xlsm',
    );
    const fileBuffer = fs.readFileSync(testFilePath);
    const upload = await this.request()
      .post(adminContract.uploadFile.path)
      .set('Authorization', `Bearer ${jwtToken}`)
      .attach('file', fileBuffer, 'Carbon-Cost Data Upload.xlsm');
    if (upload.status !== 201) {
      throw new Error('Failed to upload Excel file for tests');
    }
  }

  mocks() {
    return {
      createUser: (additionalData?: Partial<User>) =>
        createUser(this.getDataSource(), additionalData),
      createProject: async (additionalData?: Partial<Project>) =>
        createProject(this.getDataSource(), additionalData),
      createProjectScorecard: async (
        additionalData?: Partial<ProjectScorecard>,
      ) => createProjectScorecard(this.getDataSource(), additionalData),
      createCustomProject: async (
        additionalData?: { user: User } & Partial<CustomProject>,
      ) => createCustomProject(this.getDataSource(), additionalData),
    };
  }
}

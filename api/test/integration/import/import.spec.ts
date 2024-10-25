import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { adminContract } from '@shared/contracts/admin.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import * as path from 'path';
import * as fs from 'fs';
import { BaseData } from '@shared/entities/base-data.entity';

describe('Import Tests', () => {
  let testManager: TestManager;
  let testUserToken: string;
  const testFilePath = path.join(
    __dirname,
    '../../../../data/excel/data_ingestion.xlsm',
  );
  const fileBuffer = fs.readFileSync(testFilePath);
  const geoCountriesFilePath = path.join(
    __dirname,
    '../../../../api/src/geocountries.sql',
  );
  const geoCountriesSql = fs.readFileSync(geoCountriesFilePath, 'utf8');

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    const { jwtToken } = await testManager.setUpTestUser();
    testUserToken = jwtToken;
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Import Auth', () => {
    it('should throw an error if no file is sent', async () => {
      const response = await testManager
        .request()
        .post(adminContract.uploadFile.path)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send();

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors[0].title).toBe('File is required');
    });
    it('should throw an error if the user is not an admin', async () => {
      const nonAdminUser = await testManager
        .mocks()
        .createUser({ role: ROLES.PARTNER, email: 'testtt@user.com' });

      const { jwtToken } = await testManager.logUserIn(nonAdminUser);

      const response = await testManager
        .request()
        .post(adminContract.uploadFile.path)
        .set('Authorization', `Bearer ${jwtToken}`)
        .attach('file', fileBuffer, 'data_ingestion.xlsm');

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
  describe('Import Data', () => {
    it('should import data from an excel file', async () => {
      await testManager.getDataSource().query(geoCountriesSql);
      await testManager
        .request()
        .post(adminContract.uploadFile.path)
        .set('Authorization', `Bearer ${testUserToken}`)
        .attach('file', fileBuffer, 'data_ingestion.xlsm');

      const baseData = await testManager
        .getDataSource()
        .getRepository(BaseData)
        .find();

      expect(baseData).toHaveLength(200);
    }, 30000);
  });
});

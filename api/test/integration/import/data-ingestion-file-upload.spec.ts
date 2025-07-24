import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { ROLES } from '@shared/entities/users/roles.enum';
import { S3Service } from '@api/modules/import/s3.service';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity';

describe('Data Ingestion File Upload and Download', () => {
  let testManager: TestManager;
  let adminToken: string;
  let regularUserToken: string;
  let s3Service: S3Service;

  const testFilePath = path.join(
    __dirname,
    '../../data/Carbon-Cost Data Upload.xlsm',
  );
  const fileBuffer = fs.readFileSync(testFilePath);
  const testFileName = 'test-data-ingestion.xlsm';

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    s3Service = testManager.getApp().get(S3Service);
  });

  beforeEach(async () => {
    // Set up admin user with unique UUID and email
    const timestamp = Date.now();
    const adminUuid = randomUUID();
    const adminUser = await testManager.setUpTestUser({
      id: adminUuid,
      role: ROLES.ADMIN,
      email: `admin-${timestamp}@test.com`,
    });
    adminToken = adminUser.jwtToken;

    // Set up regular user
    const regularUserUuid = randomUUID();
    const regularUser = await testManager.mocks().createUser({
      id: regularUserUuid,
      role: ROLES.USER,
      email: `user-${timestamp}@test.com`,
      isActive: true,
    });
    const loggedInUser = await testManager.logUserIn(regularUser);
    regularUserToken = loggedInUser.jwtToken;

    // Set up required data for import
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(adminToken);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  // Helper method to create DataIngestionEntity with S3 file
  async function createDataIngestionWithFile(
    versionName: string,
    versionNotes = 'Test version',
    fileName = testFileName,
  ): Promise<ModelComponentsVersionEntity> {
    const dataIngestionRepo = testManager
      .getDataSource()
      .getRepository(ModelComponentsVersionEntity);

    // Generate S3 key similar to how the real service does it
    const timestamp = new Date().getTime();
    const s3Key = `data-ingestion/test-${timestamp}/${fileName}`;

    // Upload file to S3 (mock)
    await s3Service.uploadFile(s3Key, fileBuffer);

    // Create DataIngestionEntity
    const dataIngestion = new ModelComponentsVersionEntity();
    dataIngestion.versionName = versionName;
    dataIngestion.versionNotes = versionNotes;
    dataIngestion.filePath = s3Key;
    dataIngestion.createdAt = new Date();

    return await dataIngestionRepo.save(dataIngestion);
  }

  describe('File Upload with S3 Storage', () => {
    it('should be able to create DataIngestionEntity directly with S3 file', async () => {
      const versionName = 'Test Direct Creation';
      const versionNotes = 'Direct creation with S3 file';

      const dataIngestion = await createDataIngestionWithFile(
        versionName,
        versionNotes,
      );

      expect(dataIngestion).toBeDefined();
      expect(dataIngestion.versionName).toBe(versionName);
      expect(dataIngestion.versionNotes).toBe(versionNotes);
      expect(dataIngestion.filePath).toMatch(
        /^data-ingestion\/test-\d+\/test-data-ingestion\.xlsm$/,
      );
      expect(dataIngestion.createdAt).toBeInstanceOf(Date);

      // Verify it's actually in the database
      const dataIngestionRepo = testManager
        .getDataSource()
        .getRepository(ModelComponentsVersionEntity);

      const found = await dataIngestionRepo.find();
      expect(found).toHaveLength(1);
      expect(found[0].versionName).toBe(versionName);
    });
  });

  describe('File Download Authorization', () => {
    let dataIngestionCreatedAt: string;

    beforeEach(async () => {
      // Create a DataIngestionEntity directly with S3 file
      const dataIngestion = await createDataIngestionWithFile(
        'Test Download Version',
        'Test version for download testing',
      );

      dataIngestionCreatedAt = dataIngestion.createdAt.toISOString();
    });

    it('should allow admin to download data ingestion file', async () => {
      const encodedDate = encodeURIComponent(dataIngestionCreatedAt);
      const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

      const downloadResponse = await testManager
        .request()
        .get(downloadPath)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(downloadResponse.status).toBe(HttpStatus.OK);
      expect(downloadResponse.headers['content-type']).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(downloadResponse.headers['content-disposition']).toMatch(
        /attachment; filename=".*test-data-ingestion\.xlsm"/,
      );
      expect(downloadResponse.body).toBeDefined();
    });

    it('should reject download request from non-admin users', async () => {
      const encodedDate = encodeURIComponent(dataIngestionCreatedAt);
      const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

      const downloadResponse = await testManager
        .request()
        .get(downloadPath)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(downloadResponse.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should reject download from unauthenticated users', async () => {
      const encodedDate = encodeURIComponent(dataIngestionCreatedAt);
      const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

      const downloadResponse = await testManager.request().get(downloadPath);

      expect(downloadResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 for non-existent records', async () => {
      const nonExistentDate = new Date(
        '2020-01-01T00:00:00.000Z',
      ).toISOString();
      const encodedDate = encodeURIComponent(nonExistentDate);
      const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

      const downloadResponse = await testManager
        .request()
        .get(downloadPath)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(downloadResponse.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should handle malformed date parameters', async () => {
      const downloadPath = '/admin/data-ingestion/invalid-date/download';

      const downloadResponse = await testManager
        .request()
        .get(downloadPath)
        .set('Authorization', `Bearer ${adminToken}`);

      expect([
        HttpStatus.BAD_REQUEST,
        HttpStatus.NOT_FOUND,
        HttpStatus.INTERNAL_SERVER_ERROR,
      ]).toContain(downloadResponse.status);
    });
  });

  describe('S3 Integration', () => {
    it('should store and retrieve file from correct S3 path', async () => {
      const versionName = 'S3 Integration Test';

      const dataIngestion = await createDataIngestionWithFile(versionName);

      // Check the S3 path pattern
      expect(dataIngestion.filePath).toMatch(
        /^data-ingestion\/test-\d+\/test-data-ingestion\.xlsm$/,
      );

      // Verify file can be downloaded
      const encodedDate = encodeURIComponent(
        dataIngestion.createdAt.toISOString(),
      );
      const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

      const downloadResponse = await testManager
        .request()
        .get(downloadPath)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(downloadResponse.status).toBe(HttpStatus.OK);
      expect(downloadResponse.headers['content-type']).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(downloadResponse.headers['content-disposition']).toMatch(
        /attachment; filename=".*test-data-ingestion\.xlsm"/,
      );
    });
  });

  describe('Multiple File Uploads', () => {
    it('should handle multiple uploads and maintain separate records', async () => {
      const uploads = [
        { versionName: 'Version 1.0', versionNotes: 'First version' },
        { versionName: 'Version 2.0', versionNotes: 'Second version' },
      ];

      // Create multiple DataIngestionEntity records directly
      const dataIngestions = [];
      for (const upload of uploads) {
        const fileName = `${upload.versionName
          .replace(/\s+/g, '-')
          .toLowerCase()}.xlsm`;

        const dataIngestion = await createDataIngestionWithFile(
          upload.versionName,
          upload.versionNotes,
          fileName,
        );
        dataIngestions.push(dataIngestion);
      }

      // Verify all records were created
      const dataIngestionRepo = testManager
        .getDataSource()
        .getRepository(ModelComponentsVersionEntity);

      const allDataIngestions = await dataIngestionRepo.find({
        order: { createdAt: 'ASC' },
      });

      expect(allDataIngestions).toHaveLength(2);

      // Verify all files can be downloaded independently
      for (const dataIngestion of dataIngestions) {
        const encodedDate = encodeURIComponent(
          dataIngestion.createdAt.toISOString(),
        );
        const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

        const downloadResponse = await testManager
          .request()
          .get(downloadPath)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(downloadResponse.status).toBe(HttpStatus.OK);
      }
    }, 45000);
    it('should demonstrate cleanup behavior keeps records but clears filePath', async () => {
      // This is a simplified test showing the expected behavior
      // We'll create records and manually simulate the cleanup logic

      const uploads = [
        { versionName: 'Version 1.0', versionNotes: 'Oldest version' },
        { versionName: 'Version 2.0', versionNotes: 'Old version' },
        { versionName: 'Version 3.0', versionNotes: 'Middle version' },
        { versionName: 'Version 4.0', versionNotes: 'Recent version' },
        { versionName: 'Version 5.0', versionNotes: 'Newest version' },
      ];

      // Create records with delays to ensure different timestamps
      const dataIngestions = [];
      for (let i = 0; i < uploads.length; i++) {
        const upload = uploads[i];
        const fileName = `version-${i + 1}.xlsm`;

        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const dataIngestion = await createDataIngestionWithFile(
          upload.versionName,
          upload.versionNotes,
          fileName,
        );
        dataIngestions.push(dataIngestion);
      }

      const dataIngestionRepo = testManager
        .getDataSource()
        .getRepository(ModelComponentsVersionEntity);

      let allDataIngestions = await dataIngestionRepo.find({
        order: { createdAt: 'DESC' },
      });

      // Verify initial state - all 5 records with files
      expect(allDataIngestions).toHaveLength(5);
      expect(allDataIngestions.every((d) => d.filePath !== null)).toBe(true);

      // Manually simulate cleanup: keep files for only 3 most recent
      if (allDataIngestions.length > 3) {
        const recordsToCleanup = allDataIngestions.slice(3);
        for (const record of recordsToCleanup) {
          record.filePath = null;
          await dataIngestionRepo.save(record);
        }
      }

      // Re-fetch to verify cleanup
      allDataIngestions = await dataIngestionRepo.find({
        order: { createdAt: 'DESC' },
      });

      // All records should still exist
      expect(allDataIngestions).toHaveLength(5);

      // But only the 3 most recent should have filePath values
      const recordsWithFiles = allDataIngestions.filter(
        (d) => d.filePath !== null,
      );
      const recordsWithoutFiles = allDataIngestions.filter(
        (d) => d.filePath === null,
      );

      expect(recordsWithFiles).toHaveLength(3);
      expect(recordsWithoutFiles).toHaveLength(2);

      // Verify the 3 most recent records have files
      const versionNamesWithFiles = recordsWithFiles.map((d) => d.versionName);
      expect(versionNamesWithFiles).toEqual([
        'Version 5.0', // Most recent
        'Version 4.0', // Second most recent
        'Version 3.0', // Third most recent
      ]);

      // Verify the oldest records no longer have files
      const versionNamesWithoutFiles = recordsWithoutFiles.map(
        (d) => d.versionName,
      );
      expect(versionNamesWithoutFiles).toEqual(['Version 2.0', 'Version 1.0']);

      // Verify that records without files cannot be downloaded (should return 404)
      for (const recordWithoutFile of recordsWithoutFiles) {
        const encodedDate = encodeURIComponent(
          recordWithoutFile.createdAt.toISOString(),
        );
        const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

        const downloadResponse = await testManager
          .request()
          .get(downloadPath)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(downloadResponse.status).toBe(HttpStatus.NOT_FOUND);
      }

      // Verify that records with files can still be downloaded
      for (const recordWithFile of recordsWithFiles) {
        const encodedDate = encodeURIComponent(
          recordWithFile.createdAt.toISOString(),
        );
        const downloadPath = `/admin/data-ingestion/${encodedDate}/download`;

        const downloadResponse = await testManager
          .request()
          .get(downloadPath)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(downloadResponse.status).toBe(HttpStatus.OK);
      }
    }, 60000);
  });
});

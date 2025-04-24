import { S3Service } from '@api/modules/import/s3.service';
import { S3 } from '@aws-sdk/client-s3';
import { usersContract } from '@shared/contracts/users.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { TestManager } from '../../utils/test-manager';

describe('User Uploads', () => {
  let testManager: TestManager;
  let testUserToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    const { jwtToken } = await testManager.setUpTestUser({
      role: ROLES.ADMIN, // Can test everything if the user is an admin
    });
    testUserToken = jwtToken;
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('List and download available templates that users can submit', async () => {
    const response = await testManager
      .request()
      .get('/users/upload-data/templates')
      .set('Authorization', `Bearer ${testUserToken}`);

    const templates = response.body.data;
    expect(response.status).toBe(200);
    expect(templates).toHaveLength(2);

    const downloadResponse = await testManager
      .request()
      .get(`/users/upload-data/templates/${templates[0].id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(downloadResponse.status).toBe(200);
    expect(downloadResponse.headers['content-disposition']).toBe(
      `attachment; filename="${templates[0].fileName}"`,
    );
  });

  test('User uploads files and admin can download them', async () => {
    const fileName = 'user_upload_test_file.xlsx';
    const filePath = `${__dirname}/../data/${fileName}`;

    const uploadResponse = await testManager
      .request()
      .post('/users/upload-data')
      .set('Authorization', `Bearer ${testUserToken}`)
      .attach('file', filePath, fileName);

    expect(uploadResponse.status).toBe(201);

    const userUpload = uploadResponse.body.data;

    const downloadResponse = await testManager
      .request()
      .get(
        `/users/upload-data/submissions/${userUpload.id}/${userUpload.files[0].id}`,
      )
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(downloadResponse.status).toBe(200);
    expect(downloadResponse.headers['content-disposition']).toBe(
      `attachment; filename="${fileName}"`,
    );
  });

  test('Invalid file types should be rejected', async () => {
    const fileName = 'user_upload_test_file.txt';
    const filePath = `${__dirname}/../data/${fileName}`;

    const uploadResponse = await testManager
      .request()
      .post('/users/upload-data')
      .set('Authorization', `Bearer ${testUserToken}`)
      .attach('file', filePath, fileName);

    expect(uploadResponse.status).toBe(400);
    expect(uploadResponse.body.errors).toHaveLength(1);
  });

  test('User uploads files and admin can delete them', async () => {
    const fileName = 'user_upload_test_file.xlsx';
    const filePath = `${__dirname}/../data/${fileName}`;

    const uploadResponse = await testManager
      .request()
      .post('/users/upload-data')
      .set('Authorization', `Bearer ${testUserToken}`)
      .attach('file', filePath, fileName);

    expect(uploadResponse.status).toBe(201);

    const userUpload = uploadResponse.body.data;
    const deleteResponse = await testManager
      .request()
      .delete(
        usersContract.deleteUploadedData.path.replace(':id', userUpload.id),
      )
      .set('Authorization', `Bearer ${testUserToken}`);

    expect(deleteResponse.status).toBe(204);

    const s3Service = testManager.getApp().get(S3Service);
    const s3Files = await s3Service.listFiles();
    for (const file of userUpload.files) {
      const foundFile = s3Files.find((s3File) => s3File.Key === file.key);
      expect(foundFile).toBeUndefined();
    }
  });
});

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from '@shared/entities/users/user.entity';
import { TestManager } from '../../utils/test-manager';

describe('Sign-in E2E Tests', () => {
  let app: INestApplication;
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    app = testManager.getApp();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('should return 404 when user tries to sign in with non-existing credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: 'non-existing@user.com', password: '12345567' });

    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  });

  it('should return 401 when user tries to sign in with an incorrect password', async () => {
    const user: User = await testManager
      .mocks()
      .createUser({ email: 'test@test.com', password: '12345678' });

    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  });

  it('should return 200 and an access token when user successfully signs in', async () => {
    const user: User = await testManager
      .mocks()
      .createUser({ email: 'test@test.com', password: '12345678' });

    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
  });
  it('should return 401 when user tries to sign in with an inactive account', async () => {
    const inactiveUser: User = await testManager
      .mocks()
      .createUser({ isActive: false });

    const response = await testManager
      .request()
      .post('/authentication/login')
      .send({ email: inactiveUser.email, password: inactiveUser.password });

    expect(response.status).toBe(401);
  });
});

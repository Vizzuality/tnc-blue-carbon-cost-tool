import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';

describe('Sign In', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('A user tries to sign in with non-existing credentials', async () => {
    // When the user tries to sign in with non existing credentials
    const response = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'non_existant_email@test.com',
        password: 'wrong_password',
      });

    // We should get back UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  });

  test('Should return 401 when user tries to sign in with an incorrect password', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'random@test.com',
    });

    // But tries to sign in with a wronf password
    const response = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'random@test.com',
        password: 'wrong_password',
      });

    // We should get back UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  });

  test('Should return 201 and an access token when user successfully signs in', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // And the user tries to sign in with valid credentials
    const response = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'test@test.com',
        password: '12345678',
      });

    // We should get back OK response and an access token
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.accessToken).toBeDefined();
  });

  test('Should return 201 an access token and set a backoffice cookie when an admin user successfully signs in', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.ADMIN,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // And the user tries to sign in with valid credentials
    const response = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'test@test.com',
        password: '12345678',
      });

    // We should get back OK response and an access token
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.accessToken).toBeDefined();
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toHaveLength(1);
    expect(decodeURIComponent(setCookieHeader[0])).toMatch(
      /^backoffice=s:[^\s]+\.[^\s]+;/,
    );
  });

  test('Should return UNAUTHORIZED when trying to sign in with an inactive account', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: false,
      password: '12345678',
    });

    // But the user tries to sign in with an inactive account
    const response = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'test@test.com',
        password: '12345678',
      });

    // We should get back UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.errors[0].title).toEqual('Invalid credentials');
  });
});

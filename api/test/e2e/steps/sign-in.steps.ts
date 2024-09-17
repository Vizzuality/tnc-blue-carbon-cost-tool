import { defineFeature, loadFeature } from 'jest-cucumber';
import { Response } from 'supertest';
import { TestManager } from 'api/test/utils/test-manager';
import { User } from '@shared/entities/users/user.entity';

const feature = loadFeature('./test/e2e/features/sign-in.feature');

defineFeature(feature, (test) => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('A user tries to sign in with non-existing credentials', ({
    when,
    then,
    and,
  }) => {
    let response: Response;

    when(
      'a user attempts to sign in with non-existing credentials',
      async () => {
        response = await testManager
          .request()
          .post('/authentication/login')
          .send({ email: 'non-existing@user.com', password: '12345567' });
      },
    );

    then(
      /^the user should receive a (\d+) status code$/,
      (statusCode: string) => {
        expect(response.status).toBe(Number.parseInt(statusCode, 10));
      },
    );

    and(/^the response message should be "(.*)"$/, (message: string) => {
      expect(response.body.message).toEqual(message);
    });
  });

  test('A user tries to sign in with an incorrect password', ({
    given,
    when,
    then,
    and,
  }) => {
    let user: User;
    let response: Response;

    given('a user exists with valid credentials', async () => {
      user = await testManager
        .mocks()
        .createUser({ email: 'test@test.com', password: '12345678' });
    });

    when('a user attempts to sign in with an incorrect password', async () => {
      response = await testManager
        .request()
        .post('/authentication/login')
        .send({ email: user.email, password: 'wrongpassword' });
    });

    then(
      /^the user should receive a (\d+) status code$/,
      (statusCode: string) => {
        expect(response.status).toBe(Number.parseInt(statusCode, 10));
      },
    );

    and(/^the response message should be "(.*)"$/, (message: string) => {
      expect(response.body.message).toEqual(message);
    });
  });

  test('A user successfully signs in', ({ given, when, then, and }) => {
    let user: User;
    let response: Response;

    given('a user exists with valid credentials', async () => {
      user = await testManager
        .mocks()
        .createUser({ email: 'test@test.com', password: '12345678' });
    });

    when('a user attempts to sign in with valid credentials', async () => {
      response = await testManager
        .request()
        .post('/authentication/login')
        .send({ email: user.email, password: user.password });
    });

    then(
      /^the user should receive a (\d+) status code$/,
      (statusCode: string) => {
        expect(response.status).toBe(Number.parseInt(statusCode, 10));
      },
    );

    and('the access token should be defined', () => {
      expect(response.body.accessToken).toBeDefined();
    });
  });
});

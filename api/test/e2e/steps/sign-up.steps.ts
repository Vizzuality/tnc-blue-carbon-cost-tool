import { defineFeature, loadFeature } from 'jest-cucumber';
import { Response } from 'supertest';
import { User } from '@shared/entities/users/user.entity';
import { TestManager } from 'api/test/utils/test-manager';

const feature = loadFeature('./test/e2e/features/sign-up.feature');

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

  test('A user cannot sign up with an already registered email', ({
    given,
    when,
    then,
    and,
  }) => {
    let existingUser: User;
    let response: Response;

    given('a user exists with valid credentials', async () => {
      existingUser = await testManager.mocks().createUser({
        email: 'existing@test.com',
        password: 'password123',
      });
    });

    when('the user attempts to sign up with the same email', async () => {
      response = await testManager
        .request()
        .post('/authentication/signup')
        .send({ email: existingUser.email, password: 'password123' });
    });

    then(
      /the user should receive a (\d+) status code/,
      async (statusCode: string) => {
        expect(response.status).toBe(Number.parseInt(statusCode));
      },
    );

    and('the response message should be "Email already exists"', async () => {
      expect(response.body.message).toEqual(
        `Email ${existingUser.email} already exists`,
      );
    });
  });

  test('A user successfully signs up with a new email', ({
    when,
    then,
    and,
  }) => {
    let newUser: { email: string; password: string };
    let createdUser: User;
    let response: Response;

    when('a user attempts to sign up with valid credentials', async () => {
      newUser = { email: 'newuser@test.com', password: '12345678' };
      response = await testManager
        .request()
        .post('/authentication/signup')
        .send({
          email: newUser.email,
          password: newUser.password,
        });
    });

    then('the user should be registered successfully', async () => {
      expect(response.status).toBe(201);
    });

    and('the user should have a valid ID and email', async () => {
      createdUser = await testManager
        .getDataSource()
        .getRepository(User)
        .findOne({ where: { email: newUser.email } });

      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toEqual(newUser.email);
    });
  });
});

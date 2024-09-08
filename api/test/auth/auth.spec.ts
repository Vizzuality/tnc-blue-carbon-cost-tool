import { TestManager } from '../utils/test-manager';

import { User } from '@shared/entities/users/user.entity';

describe('Authentication', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    console.log('ENV', process.env.NODE_ENV);
    testManager = await TestManager.createTestManager();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });
  describe('Sign Up', () => {
    test.skip(`it should throw validation errors`, async () => {});
    test(`it should throw email already exist error`, async () => {
      const user = await testManager.mocks().createUser({});
      const response = await testManager
        .request()
        .post('/authentication/signup')
        .send({
          email: user.email,
          password: user.password,
        });
      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        `Email ${user.email} already exists`,
      );
      console.log('RESPONSE', response.body);
    });
    test(`it should sign up a new user`, async () => {
      const newUser = { email: 'test@test.com', password: '12345678' };
      const response = await testManager
        .request()
        .post('/authentication/signup')
        .send({
          email: newUser.email,
          password: newUser.password,
        });
      const user = await testManager
        .getDataSource()
        .getRepository(User)
        .findOne({
          where: { email: newUser.email },
        });
      expect(user.id).toBeDefined();
      expect(user.email).toEqual(newUser.email);
    });
  });
  describe('Sign In', () => {
    test(`it should throw an error if no user exists with provided credentials`, async () => {});
    test(`it should throw an error if password is incorrect`, async () => {});
    test(`it should sign in a user`, async () => {});
  });
});

import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { usersContract } from '@shared/contracts/users.contract';
import { ROLES } from '@shared/entities/users/roles.enum';

describe('Delete Account', () => {
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

  test("An existing user should be able to delete it's account", async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    const { jwtToken } = await testManager.logUserIn(user);

    // And the user tries to sign in with valid credentials
    const response = await testManager
      .request()
      .delete(usersContract.deleteMe.path)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    // We should get back OK response and an access token
    expect(response.status).toBe(HttpStatus.OK);
  });
});

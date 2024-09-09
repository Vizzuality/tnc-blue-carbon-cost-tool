import { TestManager } from '../utils/test-manager';

import { User } from '@shared/entities/users/user.entity';
import { ROLES } from '@api/modules/auth/authorisation/roles.enum';

describe('Authorization', () => {
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
  test('a user should have a default general user role when signing up', async () => {
    await testManager
      .request()
      .post('/authentication/signup')
      .send({ email: 'test@test.com', password: '123456' });

    const user = await testManager
      .getDataSource()
      .getRepository(User)
      .findOne({ where: { email: 'test@test.com' } });

    expect(user.role).toEqual(ROLES.GENERAL_USER);

    describe('ROLE TEST ENDPOINTS, REMOVE!', () => {
      test('when role required is general user, the general user and above roles should have access', async () => {
        const user = await testManager
          .mocks()
          .createUser({ role: ROLES.GENERAL_USER });
        const { jwtToken } = await testManager.logUserIn(user);
      });
    });
  });
});

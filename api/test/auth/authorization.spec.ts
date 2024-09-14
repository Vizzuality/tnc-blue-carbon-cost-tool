import { ROLES } from '@api/modules/auth/authorisation/roles.enum';
import { TestManager } from '../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';

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
  });

  describe('ROLE TEST ENDPOINTS, REMOVE!', () => {
    test('when role required is GENERAL_USER, all roles should have access', async () => {
      const roles = [ROLES.GENERAL_USER, ROLES.PARTNER, ROLES.ADMIN];

      for (const role of roles) {
        const user = await testManager
          .mocks()
          .createUser({ role, email: `${role}@email.com` });
        const { jwtToken } = await testManager.logUserIn(user);

        const response = await testManager
          .request()
          .get('/users/user')
          .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.arrayContaining([
            ROLES.GENERAL_USER,
            ROLES.PARTNER,
            ROLES.ADMIN,
          ]),
        );
      }
    });

    test('when role required is PARTNER, only PARTNER and ADMIN roles should have access', async () => {
      const allowedRoles = [ROLES.PARTNER, ROLES.ADMIN];
      const deniedRoles = [ROLES.GENERAL_USER];

      for (const role of allowedRoles) {
        const user = await testManager
          .mocks()
          .createUser({ role, email: `${role}@email.com` });
        const { jwtToken } = await testManager.logUserIn(user);

        const response = await testManager
          .request()
          .get('/users/partner')
          .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.arrayContaining([ROLES.PARTNER, ROLES.ADMIN]),
        );
      }

      for (const role of deniedRoles) {
        const user = await testManager
          .mocks()
          .createUser({ role, email: `${role}@email.com` });
        const { jwtToken } = await testManager.logUserIn(user);

        const response = await testManager
          .request()
          .get('/users/partner')
          .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(403);
      }
    });

    test('when role required is ADMIN, only ADMIN role should have access', async () => {
      const allowedRoles = [ROLES.ADMIN];
      const deniedRoles = [ROLES.GENERAL_USER, ROLES.PARTNER];

      for (const role of allowedRoles) {
        const user = await testManager
          .mocks()
          .createUser({ role, email: `${role}@email.com` });
        const { jwtToken } = await testManager.logUserIn(user);

        const response = await testManager
          .request()
          .get('/users/admin')
          .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([ROLES.ADMIN]);
      }

      for (const role of deniedRoles) {
        const user = await testManager
          .mocks()
          .createUser({ role, email: `${role}@email.com` });
        const { jwtToken } = await testManager.logUserIn(user);

        const response = await testManager
          .request()
          .get('/users/admin')
          .set('Authorization', `Bearer ${jwtToken}`);

        expect(response.status).toBe(403);
      }
    });
  });
});

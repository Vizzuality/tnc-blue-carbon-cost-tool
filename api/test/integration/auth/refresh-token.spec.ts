import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { User } from '@shared/entities/users/user.entity';
import { TestManager } from 'api/test/utils/test-manager';

describe('Refresh token', () => {
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

  describe('AuthenticationController', () => {
    it('should return a new token pair when the refresh token is valid', async () => {
      // Given
      const user = await testManager.mocks().createUser({
        email: 't@t.com',
        isActive: true,
        role: ROLES.PARTNER,
      });

      const { jwtToken: accessToken, refreshToken } =
        await testManager.logUserIn(user);

      // This needed to ensure the generated token is different.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // When
      const refreshRes = await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken });

      const newAccessToken = refreshRes.body.accessToken;
      const newRefreshToken = refreshRes.body.refreshToken;

      // Then
      expect(refreshRes.status).toBe(200);
      expect(newAccessToken).not.toBe(accessToken);
      expect(newRefreshToken).not.toBe(refreshToken);
    });

    it('should return a 204 after having revoked a refresh token when the user logs out', async () => {
      // Given
      const user = await testManager.mocks().createUser({
        email: 't@t.com',
        isActive: true,
        role: ROLES.PARTNER,
      });

      const { jwtToken: accessToken, refreshToken } =
        await testManager.logUserIn(user);

      // When
      const res = await testManager
        .request()
        .post(authContract.logout.path)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      const refreshRes = await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken });

      // Then
      expect(res.status).toBe(204);
      expect(refreshRes.status).toBe(401);
    });

    it('should return 401 status code if the refresh token has already been used (replay attack)', async () => {
      // Given
      const user = await testManager.mocks().createUser({
        email: 't@t.com',
        isActive: true,
        role: ROLES.PARTNER,
      });

      const { refreshToken } = await testManager.logUserIn(user);

      // When
      await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken });

      const res = await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken });

      expect(res.status).toBe(401);
    });

    it('should return a 401 status code when the refresh token sent is valid but the user is not found or inactive', async () => {
      // Given
      const user = await testManager.mocks().createUser({
        email: 'inactive@t.com',
        isActive: true,
        role: ROLES.PARTNER,
      });

      const { refreshToken } = await testManager.logUserIn(user);

      user.isActive = false;
      await testManager.getDataSource().getRepository(User).save(user);

      // When
      const refreshRes = await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken });

      // Then
      expect(refreshRes.status).toBe(401);
    });

    it('should return a 401 status code when the refresh token sent is not valid', async () => {
      const res = await testManager
        .request()
        .post(authContract.refreshToken.path)
        .send({ refreshToken: 'fake_token' });

      expect(res.status).toBe(401);
    });
  });
});

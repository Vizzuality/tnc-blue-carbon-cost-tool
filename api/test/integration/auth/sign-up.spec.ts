import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@api/modules/auth/roles.enum';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';

//create-user.feature

describe('Create Users', () => {
  let testManager: TestManager;
  let jwtManager: JwtManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    jwtManager = testManager.getModule<JwtManager>(JwtManager);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('A sign-up token should not be valid if the user bound to that token has already been activated', async () => {
    // Given a user exists with valid credentials
    // But the user has the role partner
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'random@test.com',
    });

    const token = jwtManager.signSignUpToken(user.id);

    // When the user creates a new user

    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${token}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.SIGN_UP });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Sign up should fail if the current password is incorrect', async () => {
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'random@test.com',
      isActive: true,
    });
    const token = await jwtManager.signSignUpToken(user.id);
  });
});

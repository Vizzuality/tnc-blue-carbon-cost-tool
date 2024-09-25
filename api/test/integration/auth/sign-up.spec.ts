import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@api/modules/auth/roles.enum';

//create-user.feature

describe('Create Users', () => {
  let testManager: TestManager;
  let apiConfig: ApiConfigService;
  let jwtService: JwtService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    apiConfig = testManager.getModule<ApiConfigService>(ApiConfigService);
    jwtService = testManager.getModule<JwtService>(JwtService);
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
      isActive: true,
    });
    const { secret, expiresIn } = apiConfig.getJWTConfigByType(
      TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION,
    );

    const token = jwtService.sign({ id: user.id }, { secret, expiresIn });

    // When the user creates a new user

    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${token}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.EMAIL_CONFIRMATION });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});

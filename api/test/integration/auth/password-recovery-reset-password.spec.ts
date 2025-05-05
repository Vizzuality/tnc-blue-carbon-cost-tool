import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { JwtConfigHandler } from '@api/modules/config/auth-config.handler';
import { ConfigService } from '@nestjs/config';

describe('Password Recovery - Reset Password', () => {
  let testManager: TestManager;
  let jwtManager: JwtManager;
  let configService: ConfigService;
  let jwtConfigHandler: JwtConfigHandler;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    jwtManager = testManager.getModule<JwtManager>(JwtManager);
    configService = testManager.getModule<ConfigService>(ConfigService);
    jwtConfigHandler =
      testManager.getModule<JwtConfigHandler>(JwtConfigHandler);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('Successfully resetting the password with a valid token', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // And has a valid reset password token
    const { resetPasswordToken } = await jwtManager.signResetPasswordToken(
      user.id,
    );

    // When the user tries reset the password with a new valid password
    const resetResponse = await testManager
      .request()
      .post(authContract.resetPassword.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .send({
        password: 'new_password',
      });

    // We should get back 201 response
    expect(resetResponse.status).toBe(HttpStatus.CREATED);

    // And when the user tries to login using the new password
    const loginResponse = await testManager
      .request()
      .post(authContract.login.path)
      .send({
        email: 'test@test.com',
        password: 'new_password',
      });

    // We should get back 201 response
    expect(loginResponse.status).toBe(HttpStatus.CREATED);
  });

  test('Failing to reset the password with an expired token', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // But with an expired token
    jest.spyOn(jwtConfigHandler, 'getJwtConfigByType').mockReturnValueOnce({
      secret: configService.getOrThrow('RESET_PASSWORD_TOKEN_SECRET'),
      expiresIn: '1ms',
    });

    const { resetPasswordToken } = await jwtManager.signResetPasswordToken(
      user.id,
    );

    // When the user tries reset the password with a new valid password
    const resetResponse = await testManager
      .request()
      .post(authContract.resetPassword.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .send({
        password: 'new_password',
      });

    // We should get back UNAUTHORIZED response
    expect(resetResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});

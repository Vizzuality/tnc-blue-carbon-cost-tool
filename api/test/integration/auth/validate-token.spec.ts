import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { JwtConfigHandler } from '@api/modules/config/auth-config.handler';
import { ConfigService } from '@nestjs/config';

describe('Validate Token', () => {
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

  // Scenarios for Reset Password Tokens
  test('Validating a valid reset-password token', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // That has requested a reset password
    const { resetPasswordToken } = await jwtManager.signResetPasswordToken(
      user.id,
    );

    // When the users tries to validate the token with type "reset-password"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an OK response
    expect(response.status).toBe(HttpStatus.OK);
  });

  test('Validating an expired reset-password token', async () => {
    // When an user with an expired token
    jest.spyOn(jwtConfigHandler, 'getJwtConfigByType').mockReturnValueOnce({
      secret: configService.getOrThrow('RESET_PASSWORD_TOKEN_SECRET'),
      expiresIn: '1ms',
    });

    const { resetPasswordToken } =
      await jwtManager.signResetPasswordToken('fake_id');

    // When the users tries to validate the token with type "reset-password"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Validating a reset-password token with an invalid signature', async () => {
    // When an user with an invalid token
    jest.spyOn(jwtConfigHandler, 'getJwtConfigByType').mockReturnValueOnce({
      secret: 'WRONG_SECRET',
      expiresIn: '2h',
    });

    const { resetPasswordToken } =
      await jwtManager.signResetPasswordToken('fake_id');

    // When the users tries to validate the token with type "reset-password"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Validating a reset-password token with an incorrect type parameter', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // That has requested a reset password
    const { resetPasswordToken } = await jwtManager.signResetPasswordToken(
      user.id,
    );

    // When the users tries to validate the token with a wrong type
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Validating a reset-password token without specifying the type', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // That has requested a reset password
    const { resetPasswordToken } = await jwtManager.signResetPasswordToken(
      user.id,
    );

    // When the users tries to validate the token with type "reset-password"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${resetPasswordToken}`);

    // We should get back a BAD_REQUEST response
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  // Scenarios for Access Tokens
  test('Validating a valid access token', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // That has a valid access token
    const { accessToken } = await jwtManager.signAccessToken(user.id);

    // When the users tries to validate the token with type "access"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });

    // We should get back an OK response
    expect(response.status).toBe(HttpStatus.OK);
  });

  test('Validating an expired access token', async () => {
    // When an user with an expired token
    jest.spyOn(jwtConfigHandler, 'getJwtConfigByType').mockReturnValueOnce({
      secret: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: '1ms',
    });

    const { accessToken } = await jwtManager.signAccessToken('fake_id');

    // When the users tries to validate the token with type "access"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Validating an access token with an invalid signature', async () => {
    // When an user with an invalid token
    jest.spyOn(jwtConfigHandler, 'getJwtConfigByType').mockReturnValueOnce({
      secret: 'WRONG_SECRET',
      expiresIn: '2h',
    });

    const { accessToken } = await jwtManager.signAccessToken('fake_id');

    // Tries to validate the token with type "access"
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Validating an access token with an incorrect type parameter', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // That has a valid access token
    const { accessToken } = await jwtManager.signAccessToken(user.id);

    // And tries to validate the token with a wrong type
    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an UNAUTHORIZED response
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  // Common Scenarios for Both Token Types
  test('Validating a token without providing the Authorization header', async () => {
    // When the user attempts to validate a reset-password token without providing the Authorization header
    const response1 = await testManager
      .request()
      .get(authContract.validateToken.path)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an UNAUTHORIZED response
    expect(response1.status).toBe(HttpStatus.UNAUTHORIZED);

    // When the user attempts to validate an access token without providing the Authorization header
    const response2 = await testManager
      .request()
      .get(authContract.validateToken.path)
      .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });

    // We should get back an UNAUTHORIZED response
    expect(response2.status).toBe(HttpStatus.UNAUTHORIZED);
  });
});

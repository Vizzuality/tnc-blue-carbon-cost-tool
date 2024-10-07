import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { User } from '@shared/entities/users/user.entity';

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

    const { signUpToken } = await jwtManager.signSignUpToken(user.id);

    // When the user creates a new user

    const response = await testManager
      .request()
      .get(authContract.validateToken.path)
      .set('Authorization', `Bearer ${signUpToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.SIGN_UP });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Sign up should fail if the auto-generated password is incorrect', async () => {
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'random@test.com',
      isActive: false,
    });
    const { signUpToken } = await jwtManager.signSignUpToken(user.id);

    const response = await testManager
      .request()
      .post(authContract.signUp.path)
      .set('Authorization', `Bearer ${signUpToken}`)
      .query({ tokenType: TOKEN_TYPE_ENUM.SIGN_UP })
      .send({ password: 'wrongpassword', newPassword: 'newpassword' });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  test('Sign up should succeed if the auto-generated password is correct and the user should be activated and allowed to get a access token', async () => {
    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'test@test.com',
      isActive: false,
    });
    const { signUpToken } = await jwtManager.signSignUpToken(user.id);

    const response = await testManager
      .request()
      .post(authContract.signUp.path)
      .set('Authorization', `Bearer ${signUpToken}`)
      .send({ password: user.password, newPassword: 'newpassword' });

    expect(response.status).toBe(HttpStatus.CREATED);
    const foundUser = await testManager
      .getDataSource()
      .getRepository(User)
      .findOneBy({ id: user.id });

    expect(foundUser.isActive).toBe(true);

    const login = await testManager
      .request()
      .post(authContract.login.path)
      .send({ email: user.email, password: 'newpassword' });

    expect(login.body.accessToken).toBeDefined();
  });
});

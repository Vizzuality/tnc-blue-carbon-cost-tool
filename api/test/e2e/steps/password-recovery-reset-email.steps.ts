import { defineFeature, loadFeature } from 'jest-cucumber';
import { Response } from 'supertest';
import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';

const feature = loadFeature(
  './test/e2e/features/password-recovery-reset-password.feature',
);

describe('Reset Password', () => {
  defineFeature(feature, (test) => {
    let testManager: TestManager;
    let jwtService: JwtService;
    let resetPasswordSecret: string;
    let apiConfigService: ApiConfigService;

    beforeAll(async () => {
      testManager = await TestManager.createTestManager();
      jwtService = testManager.moduleFixture.get<JwtService>(JwtService);
      apiConfigService =
        testManager.moduleFixture.get<ApiConfigService>(ApiConfigService);
    });

    beforeEach(async () => {
      resetPasswordSecret = apiConfigService.getJWTConfigByType(
        TOKEN_TYPE_ENUM.RESET_PASSWORD,
      ).secret;
    });

    afterEach(async () => {
      await testManager.clearDatabase();
    });

    afterAll(async () => {
      await testManager.close();
    });

    // Scenario 1: Successfully resetting the password with a valid token
    test('Successfully resetting the password with a valid token', ({
      given,
      when,
      then,
      and,
    }) => {
      let user: User;
      let resetPasswordToken: string;
      let response: Response;

      given('a user has a valid reset-password token', async () => {
        user = await testManager.mocks().createUser({
          email: 'validuser@example.com',
          password: 'OldPassword123',
        });
        resetPasswordToken = jwtService.sign(
          { sub: user.id },
          { secret: resetPasswordSecret, expiresIn: '1h' },
        );
      });

      when(
        'the user attempts to reset their password with a new valid password',
        async () => {
          response = await testManager
            .request()
            .post('/authentication/reset-password')
            .set('Authorization', `Bearer ${resetPasswordToken}`)
            .send({ password: 'NewPassword123' });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );

      and('the user can log in with the new password', async () => {
        const loginResponse = await testManager
          .request()
          .post('/authentication/login')
          .send({ email: user.email, password: 'NewPassword123' });

        expect(loginResponse.status).toBe(201);
        expect(loginResponse.body.accessToken).toBeDefined();
      });
    });

    // Scenario 2: Attempting to reset the password with an expired token
    test('Attempting to reset the password with an expired token', ({
      given,
      when,
      then,
    }) => {
      let user: User;
      let expiredResetPasswordToken: string;
      let response: Response;

      given('a user has an expired reset-password token', async () => {
        user = await testManager.mocks().createUser({
          email: 'expireduser@example.com',
          password: 'OldPassword123',
        });
        expiredResetPasswordToken = jwtService.sign(
          { sub: user.id },
          { secret: resetPasswordSecret, expiresIn: '1ms' },
        );
      });

      when(
        'the user attempts to reset their password with a new valid password',
        async () => {
          response = await testManager
            .request()
            .post('/authentication/reset-password')
            .set('Authorization', `Bearer ${expiredResetPasswordToken}`)
            .send({ password: 'NewPassword123' });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });
  });
});

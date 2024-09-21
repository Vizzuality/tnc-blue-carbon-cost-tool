import { defineFeature, loadFeature } from 'jest-cucumber';
import { Response } from 'supertest';

import { User } from '@shared/entities/users/user.entity';
import { TestManager } from '../../utils/test-manager';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TYPE_ENUM } from '@shared/schemas/auth/token-type.schema';

const feature = loadFeature('./test/e2e/features/validate-token.feature');

describe('Validate Token', () => {
  defineFeature(feature, (test) => {
    let testManager: TestManager;
    let apiConfig: ApiConfigService;
    let jwtService: JwtService;
    let accessTokenSecret: string;
    let resetPasswordTokenSecret: string;

    beforeAll(async () => {
      testManager = await TestManager.createTestManager();
      apiConfig =
        testManager.moduleFixture.get<ApiConfigService>(ApiConfigService);
      jwtService = testManager.moduleFixture.get<JwtService>(JwtService);
    });

    beforeEach(async () => {
      await testManager.clearDatabase();
      accessTokenSecret = apiConfig.getJWTConfigByType(
        TOKEN_TYPE_ENUM.ACCESS,
      ).secret;
      resetPasswordTokenSecret = apiConfig.getJWTConfigByType(
        TOKEN_TYPE_ENUM.RESET_PASSWORD,
      ).secret;
    });

    afterAll(async () => {
      await testManager.close();
    });

    // Scenarios for Reset Password Tokens

    test('Validating a valid reset-password token', ({ given, when, then }) => {
      let user: User;
      let resetPasswordToken: string;
      let response: Response;

      given('a user has requested a password reset', async () => {
        user = await testManager.mocks().createUser({
          email: 'resetuser@example.com',
          password: 'password123',
        });
        resetPasswordToken = jwtService.sign(
          { id: user.id },
          {
            secret: resetPasswordTokenSecret,
            expiresIn: '1h',
          },
        );
      });

      when(
        'the user attempts to validate the token with type "reset-password"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${resetPasswordToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating an expired reset-password token', ({
      given,
      when,
      then,
    }) => {
      let resetPasswordToken: string;
      let response: Response;

      given('a reset-password token has expired', async () => {
        // Create an expired token by setting expiration time in the past
        resetPasswordToken = jwtService.sign(
          { id: 'fake-user-id' },
          { secret: resetPasswordTokenSecret, expiresIn: '1ms' },
        );
      });

      when(
        'the user attempts to validate the expired token with type "reset-password"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${resetPasswordToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating a reset-password token with an invalid signature', ({
      given,
      when,
      then,
    }) => {
      let resetPasswordToken: string;
      let response: Response;

      given('a reset-password token has an invalid signature', async () => {
        resetPasswordToken = jwtService.sign(
          { id: 'fake-user-id' },
          { secret: 'invalid', expiresIn: '2h' },
        );
      });

      when(
        'the user attempts to validate the token with type "reset-password"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${resetPasswordToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating a reset-password token with an incorrect type parameter', ({
      given,
      when,
      then,
    }) => {
      let resetPasswordToken: string;
      let response: Response;

      given('a user has a valid reset-password token', async () => {
        const user = await testManager.mocks().createUser({
          email: 'incorrecttype@example.com',
          password: 'password123',
        });
        resetPasswordToken = jwtService.sign(
          { id: user.id },
          {
            secret: resetPasswordTokenSecret,
            expiresIn: '2h',
          },
        );
      });

      when(
        'the user attempts to validate the token with type "access"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${resetPasswordToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating a reset-password token without specifying the type', ({
      given,
      when,
      then,
    }) => {
      let resetPasswordToken: string;
      let response: Response;

      given('a user has a valid reset-password token', async () => {
        const user = await testManager.mocks().createUser({
          email: 'notype@example.com',
          password: 'password123',
        });
        resetPasswordToken = jwtService.sign(
          { id: user.id },
          { secret: resetPasswordTokenSecret, expiresIn: '2h' },
        );
      });

      when(
        'the user attempts to validate the token without specifying the type',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${resetPasswordToken}`);
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );

      // and(
      //   /^the response message should include "expected": "(.*)"$/,
      //   (expected: string) => {
      //     expect(response.body.message).toContain(`expected": "${expected}"`);
      //   },
      // );
    });

    // Scenarios for Access Tokens

    test('Validating a valid access token', ({ given, when, then }) => {
      let user: User;
      let accessToken: string;
      let response: Response;

      given('a user has a valid access token', async () => {
        user = await testManager.mocks().createUser({
          email: 'accesstokenuser@example.com',
          password: 'password123',
        });
        accessToken = jwtService.sign(
          { id: user.id },
          { secret: accessTokenSecret, expiresIn: '1h' },
        );
      });

      when(
        'the user attempts to validate the token with type "access"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating an expired access token', ({ given, when, then }) => {
      let expiredAccessToken: string;
      let response: Response;

      given('an access token has expired', async () => {
        expiredAccessToken = jwtService.sign(
          { id: 'fake-user-id' },
          { secret: accessTokenSecret, expiresIn: '1ms' },
        );
      });

      when(
        'the user attempts to validate the expired token with type "access"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${expiredAccessToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating an access token with an invalid signature', ({
      given,
      when,
      then,
    }) => {
      let invalidSignatureAccessToken: string;
      let response: Response;

      given('an access token has an invalid signature', async () => {
        invalidSignatureAccessToken = jwtService.sign(
          { id: 'fake-user-id' },
          { secret: 'fake-secret', expiresIn: '1h' },
        );
      });

      when(
        'the user attempts to validate the token with type "access"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${invalidSignatureAccessToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    test('Validating an access token with an incorrect type parameter', ({
      given,
      when,
      then,
    }) => {
      let accessToken: string;
      let response: Response;

      given('a user has a valid access token', async () => {
        const user = await testManager.mocks().createUser({
          email: 'incorrecttypeaccess@example.com',
          password: 'password123',
        });
        accessToken = jwtService.sign(
          { id: user.id },
          { secret: accessTokenSecret, expiresIn: '2h' },
        );
      });

      when(
        'the user attempts to validate the token with type "reset-password"',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .set('Authorization', `Bearer ${accessToken}`)
            .query({ tokenType: TOKEN_TYPE_ENUM.RESET_PASSWORD });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );
    });

    // Common Scenarios for Both Token Types

    test('Validating a token without providing the Authorization header', ({
      when,
      then,
    }) => {
      let response: Response;

      when(
        'the user attempts to validate a token without providing the Authorization header',
        async () => {
          response = await testManager
            .request()
            .get('/authentication/validate-token')
            .query({ tokenType: TOKEN_TYPE_ENUM.ACCESS }); // Type can be either 'access' or 'reset-password'
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

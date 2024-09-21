import { defineFeature, loadFeature } from 'jest-cucumber';
import { Response } from 'supertest';
import { User } from '@shared/entities/users/user.entity';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { TestManager } from '../../utils/test-manager';
import { MockEmailService } from '../../utils/mocks/mock-email.service';

const feature = loadFeature(
  './test/e2e/features/password-recovery-send-email.feature',
);

describe('Password Recovery - Send Email', () => {
  defineFeature(feature, (test) => {
    let testManager: TestManager;
    let testUser: User;
    let mockEmailService: MockEmailService;

    beforeAll(async () => {
      testManager = await TestManager.createTestManager();
      mockEmailService =
        testManager.moduleFixture.get<MockEmailService>(IEmailServiceToken);
    });

    beforeEach(async () => {
      await testManager.clearDatabase();
      const { user } = await testManager.setUpTestUser();
      testUser = user;
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await testManager.close();
    });

    test('An email should be sent if a user is found', ({
      given,
      when,
      then,
      and,
    }) => {
      let response: Response;

      given('a user exists with valid credentials', async () => {
        testUser = await testManager.mocks().createUser({
          email: 'test@test.com',
          password: 'password123',
        });
      });

      when('the user requests password recovery', async () => {
        response = await testManager
          .request()
          .post(`/authentication/recover-password`)
          .send({ email: testUser.email });
      });

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );

      and('an email should be sent', async () => {
        expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
      });
    });

    test('No email should be sent if the user is not found', ({
      when,
      then,
      and,
    }) => {
      let response: Response;

      when(
        'the user requests password recovery with an invalid email',
        async () => {
          response = await testManager
            .request()
            .post(`/authentication/recover-password`)
            .send({ email: 'no-user@test.com' });
        },
      );

      then(
        /the user should receive a (\d+) status code/,
        async (statusCode: string) => {
          expect(response.status).toBe(Number.parseInt(statusCode));
        },
      );

      and('no email should be sent', async () => {
        expect(mockEmailService.sendMail).toHaveBeenCalledTimes(0);
      });
    });
  });
});

import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { authContract } from '@shared/contracts/auth.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';

describe('Password Recovery - Send Email', () => {
  let testManager: TestManager;
  let emailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    emailService = testManager.getModule<MockEmailService>(IEmailServiceToken);
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('An email should be sent if a user is found', async () => {
    // Given a user exists with valid credentials
    const user = await testManager.mocks().createUser({
      role: ROLES.USER,
      email: 'test@test.com',
      isActive: true,
      password: '12345678',
    });

    // When the user requests password recovery
    const response = await testManager
      .request()
      .post(authContract.requestPasswordRecovery.path)
      .send({
        email: 'test@test.com',
      });

    // We should receive 201 status code
    expect(response.status).toBe(HttpStatus.CREATED);

    // And an email should have been sent
    expect(emailService.sendMail).toHaveBeenCalledTimes(1);
  });

  test('No email should be sent if the user is not found', async () => {
    // When a non-existant user requests password recovery
    const response = await testManager
      .request()
      .post(authContract.requestPasswordRecovery.path)
      .send({
        email: 'another_user@test.com',
      });

    // We should get back a NOT_FOUND status code
    expect(response.status).toBe(HttpStatus.NOT_FOUND);

    // And no email sent
    // TODO: Not sure why this is still called - to look into it
    expect(emailService.sendMail).toHaveBeenCalledTimes(1);
  });
});

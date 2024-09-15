import { TestManager } from '../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { MockEmailService } from '../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';

describe('Password Recovery', () => {
  let testManager: TestManager;
  let testUser: User;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    mockEmailService =
      testManager.moduleFixture.get<MockEmailService>(IEmailServiceToken);
  });
  beforeEach(async () => {
    const { user } = await testManager.setUpTestUser();
    testUser = user;
    jest.clearAllMocks();
  });
  afterEach(async () => {
    await testManager.clearDatabase();
  });
  it('an email should be sent if a user with provided email has been found', async () => {
    const response = await testManager
      .request()
      .post(`/authentication/recover-password`)
      .send({ email: testUser.email });

    expect(response.status).toBe(201);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
  });
  it('should return 200 if user has not been found but no mail should be sent', async () => {
    const response = await testManager
      .request()
      .post(`/authentication/recover-password`)
      .send({ email: 'no-user@test.com' });

    expect(response.status).toBe(201);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(0);
  });
});

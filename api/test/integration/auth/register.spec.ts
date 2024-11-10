import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { authContract } from '@shared/contracts/auth.contract';

describe('Register User', () => {
  let testManager: TestManager;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();

    mockEmailService =
      testManager.getModule<MockEmailService>(IEmailServiceToken);
  });
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('A new user registers, and en email should be sent', async () => {
    const newUser = {
      email: 'a-new-user@mail.com',
      name: 'A New User',
      partnerName: 'A New Partner',
    };
    const response = await testManager
      .request()
      .post(authContract.register.path)
      .send(newUser);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
    const user = await testManager
      .getDataSource()
      .getRepository(User)
      .findOne({ where: { email: newUser.email } });

    expect(user).toMatchObject(newUser);
    expect(user.isActive).toBe(false);
  });

  test('A user tries to register with an existing email', async () => {
    const user = await testManager.mocks().createUser({
      email: 'existing@gmail.com',
    });

    const response = await testManager
      .request()
      .post(authContract.register.path)
      .send({
        email: user.email,
        name: 'A New User',
        partnerName: 'A New Partner',
      });

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.errors[0].title).toEqual(
      `User with email ${user.email} already exists`,
    );
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(0);
  });
});

import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { ROLES } from '@shared/entities/users/roles.enum';

describe('Create Users', () => {
  let testManager: TestManager;
  let testUser: User;
  let jwtToken: string;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();

    mockEmailService =
      testManager.getModule<MockEmailService>(IEmailServiceToken);
  });
  beforeEach(async () => {
    const { user, jwtToken: token } = await testManager.setUpTestUser();
    testUser = user;
    jwtToken = token;
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  test('A user can not create a user if it is not an admin', async () => {
    // Given a user exists with valid credentials
    // But the user has the role partner

    const user = await testManager.mocks().createUser({
      role: ROLES.PARTNER,
      email: 'random@test.com',
    });
    const { jwtToken } = await testManager.logUserIn(user);

    // When the user creates a new user

    const response = await testManager
      .request()
      .post('/admin/users')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });
  test('An Admin tries to register a partner with an existing email', async () => {
    // Given a admin user exists with valid credentials
    // beforeAll

    // When the user creates a new user
    // But the email is already in use

    const response = await testManager
      .request()
      .post('/admin/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ email: testUser.email, partnerName: 'test' });

    // Then the user should receive a 409 status code
    expect(response.status).toBe(HttpStatus.CONFLICT);
    // And the user should receive a message containing  "Email already exists"
    expect(response.body.errors[0].title).toBe(
      `User with email ${testUser.email} already exists`,
    );
  });

  test('An Admin registers a new user ', async () => {
    // Given a admin user exists with valid credentials
    // beforeAll
    const newUser = {
      email: 'test@test.com',
      partnerName: 'test',
    };

    const response = await testManager
      .request()
      .post('/admin/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newUser);

    // Then the user should receive a 201 status code
    expect(response.status).toBe(HttpStatus.CREATED);
    //  And the user should not be active
    const createdUser = await testManager
      .getDataSource()
      .getRepository(User)
      .findOne({ where: { email: newUser.email } });

    expect(createdUser.isActive).toBe(false);
    expect(mockEmailService.sendMail).toHaveBeenCalledTimes(1);
  });
});

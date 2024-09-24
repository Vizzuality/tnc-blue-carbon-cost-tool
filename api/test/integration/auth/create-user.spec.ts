import { ROLES } from '@api/modules/auth/authorisation/roles.enum';
import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';

//create-user.feature

describe('Create Users', () => {
  let testManager: TestManager;
  let testUser: User;
  let jwtToken: string;
  let mockEmailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { user, jwtToken: token } = await testManager.setUpTestUser();
    testUser = user;
    jwtToken = token;
    mockEmailService =
      testManager.getModule<MockEmailService>(IEmailServiceToken);
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

    const user = await testManager.mocks().createUser({ role: ROLES.PARTNER });
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
      .send({ email: testUser.email, password: '12345678' });

    // Then the user should receive a 409 status code
    expect(response.status).toBe(HttpStatus.CONFLICT);
    // And the user should receive a message containing  "Email already exists"
    expect(response.body.message).toBe(
      `Email ${testUser.email} already exists`,
    );
  });

  test('An Admin registers a new user', async () => {
    // Given a admin user exists with valid credentials
    // beforeAll
    const newUser = {
      email: 'test@test.com',
      password: '12345678',
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

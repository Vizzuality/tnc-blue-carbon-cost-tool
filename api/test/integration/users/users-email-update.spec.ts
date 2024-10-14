import { createUser } from '@shared/lib/entity-mocks';
import { TestManager } from '../../utils/test-manager';
import { HttpStatus } from '@nestjs/common';
import { usersContract } from '@shared/contracts/users.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';
import { JwtManager } from '@api/modules/auth/services/jwt.manager';
import { User } from '@shared/entities/users/user.entity';
import { authContract } from '@shared/contracts/auth.contract';

describe('Users ME (e2e)', () => {
  let testManager: TestManager;
  let jwt: JwtManager;
  let emailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    emailService = testManager.getModule<MockEmailService>(IEmailServiceToken);
    jwt = testManager.getModule<JwtManager>(JwtManager);
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
  });

  afterEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Send Email Update notification', () => {
    it('Should fail if the new email is already in use, and no email should be sent', async () => {
      const previousUser = await testManager
        .mocks()
        .createUser({ role: ROLES.PARTNER });
      const user = await testManager
        .mocks()
        .createUser({ email: 'user2@mail.com', role: ROLES.PARTNER });

      const { jwtToken } = await testManager.logUserIn(user);

      const response = await testManager
        .request()
        .patch(usersContract.requestEmailUpdate.path)
        .send({ email: user.email, newEmail: previousUser.email })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.errors[0].title).toBe('Email already in use');
    });

    it('Should send an email to the new email address', async () => {
      const user = await testManager
        .mocks()
        .createUser({ role: ROLES.PARTNER });
      const { jwtToken } = await testManager.logUserIn(user);

      const newEmail = 'newmail@test.com';
      const response = await testManager
        .request()
        .patch(usersContract.requestEmailUpdate.path)
        .send({ email: user.email, newEmail })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(emailService.sendMail).toHaveBeenCalledTimes(1);
    });
  });
  describe('Confirm email update', () => {
    it('should update the email', async () => {
      const user = await testManager
        .mocks()
        .createUser({ email: 'test@test.com', role: ROLES.PARTNER });

      const { emailUpdateToken } = await jwt.signEmailUpdateToken(user.id);
      const newEmail = 'new-mail@mail.com';
      const response = await testManager
        .request()
        .patch(authContract.confirmEmail.path)
        .send({ newEmail })
        .set('Authorization', `Bearer ${emailUpdateToken}`);

      expect(response.status).toBe(200);
      const userWithUpdatedEmail = await testManager
        .getDataSource()
        .getRepository(User)
        .findOneBy({ email: newEmail });
      expect(userWithUpdatedEmail.id).toEqual(user.id);
    });
    it('should fail if the new email is already in use', async () => {
      const user = await createUser(testManager.getDataSource(), {
        email: 'user@test.com',
        role: ROLES.PARTNER,
      });

      const { emailUpdateToken } = await jwt.signEmailUpdateToken(user.id);

      const response = await testManager
        .request()
        .patch(authContract.confirmEmail.path)
        .send({ newEmail: user.email })
        .set('Authorization', `Bearer ${emailUpdateToken}`);

      expect(response.status).toBe(409);
      expect(response.body.errors[0].title).toBe('Email already in use');
    });
  });
});

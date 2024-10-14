import { createUser } from '@shared/lib/entity-mocks';
import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { usersContract } from '@shared/contracts/users.contract';
import { ROLES } from '@shared/entities/users/roles.enum';
import { MockEmailService } from '../../utils/mocks/mock-email.service';
import { IEmailServiceToken } from '@api/modules/notifications/email/email-service.interface';

describe('Users ME (e2e)', () => {
  let testManager: TestManager;
  let emailService: MockEmailService;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    emailService = testManager.getModule<MockEmailService>(IEmailServiceToken);
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Send Email Update notification', () => {
    it('Should fail if the current email sent does not match, and no email should be sent', async () => {
      const user = await testManager
        .mocks()
        .createUser({ role: ROLES.PARTNER });
      const { jwtToken } = await testManager.logUserIn(user);

      const response = await testManager
        .request()
        .patch(usersContract.requestEmailUpdate.path)
        .send({ email: 'notcurrent@mail.com', newEmail: 'new@mail.com' })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors[0].title).toBe('Invalid email provided');
      expect(emailService.sendMail).toHaveBeenCalledTimes(0);
    });
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

      const { jwtToken, password: oldPassword } =
        await testManager.logUserIn(user);
      const newPassword = 'newPassword';
      const response = await testManager
        .request()
        .patch(usersContract.updatePassword.path)
        .send({ password: oldPassword, newPassword })
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toEqual(user.id);

      const { jwtToken: noToken } = await testManager.logUserIn({
        ...user,
        password: oldPassword,
      });
      expect(noToken).toBeUndefined();

      const { jwtToken: newToken } = await testManager.logUserIn({
        ...user,
        password: newPassword,
      });

      expect(newToken).toBeDefined();
    });
    it('should fail if the email confirmation token is not authorized', async () => {
      const user = await createUser(testManager.getDataSource(), {
        email: 'user@test.com',
        role: ROLES.PARTNER,
      });

      const { jwtToken } = await testManager.logUserIn(user);
      const newName = 'newName';
      const response = await testManager
        .request()
        .patch(usersContract.updateMe.path)
        .send({ name: newName })
        .set('Authorization', `Bearer ${jwtToken}`);
      expect(response.status).toBe(201);
      expect(response.body.data.id).toEqual(user.id);
      expect(response.body.data.name).toEqual(newName);

      // Previous token should work after updating the user's email
      const userMeResponse = await testManager
        .request()
        .get('/users/me')
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(userMeResponse.status).toBe(200);
      expect(userMeResponse.body.data.name).toEqual(newName);
    });
  });
});

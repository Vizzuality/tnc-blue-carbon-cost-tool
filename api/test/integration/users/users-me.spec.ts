import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { usersContract } from '@shared/contracts/users.contract';
import { ROLES } from '@shared/entities/users/roles.enum';

describe('Users ME (e2e)', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    await testManager.clearDatabase();
  });

  afterAll(async () => {
    await testManager.close();
  });

  describe('Read', () => {
    it('should return only my own info', async () => {
      const createdUsers: User[] = [];
      for (const n of Array(3).keys()) {
        createdUsers.push(
          await testManager.mocks().createUser({
            email: `user${n}@mail.com`,
            role: ROLES.PARTNER,
          }),
        );
      }
      const { jwtToken } = await testManager.logUserIn(createdUsers[0]);
      const response = await testManager
        .request()
        .get(usersContract.findMe.path)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toEqual(createdUsers[0].id);
    });
  });

  describe('Update', () => {
    it('should update my own password', async () => {
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
    it('should update a user name', async () => {
      const user = await testManager.mocks().createUser({
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
  describe('Delete', () => {
    it('should delete my own user', async () => {
      const users: User[] = [];
      for (const n of Array(3).keys()) {
        users.push(
          await testManager
            .mocks()
            .createUser({ email: `user${n}@test.com`, role: ROLES.PARTNER }),
        );
      }
      const user = users[0];
      const { jwtToken } = await testManager.logUserIn(user);
      const response = await testManager
        .request()
        .delete(usersContract.deleteMe.path)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({});
      const foundUser = await testManager
        .getDataSource()
        .getRepository(User)
        .findOneBy({ id: user.id });

      expect(foundUser).toBeNull();
    });
  });
});

import { createUser } from '@shared/lib/entity-mocks';
import { TestManager } from '../../utils/test-manager';
import { User } from '@shared/entities/users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { usersContract } from '@shared/contracts/users.contract';

describe('Users ME (e2e)', () => {
  let testManager: TestManager;
  let authToken: string;
  let testUser: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
  });

  beforeEach(async () => {
    await testManager.clearDatabase();

    const { jwtToken, user } = await testManager.setUpTestUser();
    authToken = jwtToken;
    testUser = user;
  });

  afterAll(async () => {
    await testManager.close();
  });

  it('should return only my own info', async () => {
    const createdUsers: User[] = [];
    for (const n of Array(3).keys()) {
      createdUsers.push(
        await testManager.mocks().createUser({
          email: `user${n}@mail.com`,
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

  it('should update my own password', async () => {
    const user = await testManager
      .mocks()
      .createUser({ email: 'test@test.com' });

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
  it('should update a user', async () => {
    const user = await createUser(testManager.getDataSource(), {
      email: 'user@test.com',
    });

    const { jwtToken } = await testManager.logUserIn(user);
    const updatedUser = { email: 'new@mail.com' };
    const response = await testManager
      .request()
      .patch('/users/' + user.id)
      .send(updatedUser)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(201);
    expect(response.body.data.email).toEqual(updatedUser.email);

    // Previous token should work after updating the user's email
    const userMeResponse = await testManager
      .request()
      .get('/users/me')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(userMeResponse.status).toBe(200);
    expect(userMeResponse.body.data.email).toEqual(updatedUser.email);
  });
});

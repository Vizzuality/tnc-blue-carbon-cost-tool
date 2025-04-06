import * as request from 'supertest';
import { TestManager } from './test-manager';
import { User } from '@shared/entities/users/user.entity';

export type TestUser = {
  jwtToken: string;
  password: string;
  user: User;
  backofficeSessionCookie: string;
};

export async function logUserIn(
  testManager: TestManager,
  user: Partial<User>,
): Promise<TestUser> {
  const response = await request(testManager.getApp().getHttpServer())
    .post('/authentication/login')
    .send({ email: user.email, password: user.password });

  return {
    jwtToken: response.body.accessToken,
    user: user as User,
    password: user.password,
    backofficeSessionCookie: response.headers?.['set-cookie']?.[0],
  };
}

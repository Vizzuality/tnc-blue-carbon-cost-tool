import * as request from 'supertest';
import { TestManager } from './test-manager';
import { User } from '@shared/entities/users/user.entity';

export type TestUser = {
  jwtToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  user: User;
  password: string;
};

export async function logUserIn(
  testManager: TestManager,
  user: Partial<User>,
): Promise<TestUser> {
  const response = await request(testManager.getApp().getHttpServer())
    .post('/authentication/login')
    .send({ email: user.email, password: user.password });

  return {
    jwtToken: response.body.accessToken, // We cannot change this at the moment as a lot of tests would be affected by this
    expiresAt: response.body.expiresAt,
    refreshToken: response.body.refreshToken,
    refreshTokenExpiresAt: response.body.refreshTokenExpiresAt,
    user: user as User,
    password: user.password,
  };
}

import { DataSource } from 'typeorm';
import { User } from '@shared/entities/users/user.entity';
import { genSalt, hash } from 'bcrypt';

export const createUser = async (
  dataSource: DataSource,
  additionalData?: Partial<User>,
): Promise<User> => {
  const salt = await genSalt();
  const usedPassword = additionalData?.password ?? '12345678';
  const user = {
    email: 'test@user.com',
    ...additionalData,
    password: await hash(usedPassword, salt),
    isActive: true,
  };

  await dataSource.getRepository(User).save(user);
  return { ...user, password: usedPassword } as User;
};

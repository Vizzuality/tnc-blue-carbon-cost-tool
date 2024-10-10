import { genSalt, hash } from "bcrypt";
import { DataSource, DeepPartial } from "typeorm";
import { User } from "@shared/entities/users/user.entity";

export const createUser = async (
  dataSource: DataSource,
  additionalData?: Partial<User>,
): Promise<User> => {
  const salt = await genSalt();
  const usedPassword = additionalData?.password ?? "12345678";
  const user = {
    email: "test@user.com",
    ...additionalData,
    password: await hash(usedPassword, salt),
    isActive: additionalData?.isActive ?? true,
  };

  await dataSource.getRepository(User).save(user);
  return { ...user, password: usedPassword } as User;
};

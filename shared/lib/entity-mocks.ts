import { genSalt, hash } from "bcrypt";
import { DataSource, DeepPartial } from "typeorm";
import { User } from "@shared/entities/users/user.entity";
import {
  ACTIVITY,
  BaseData,
  ECOSYSTEM,
} from "@shared/entities/base-data.entity";

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

export const createBaseData = async (
  dataSource: DataSource,
  additionalData?: Partial<BaseData>,
): Promise<BaseData> => {
  const baseData = new BaseData();
  baseData.ecosystem = ECOSYSTEM.MANGROVE;
  baseData.countryCode = "AND";
  baseData.activity = ACTIVITY.CONSERVATION;

  return dataSource.getRepository(BaseData).save(baseData);
};

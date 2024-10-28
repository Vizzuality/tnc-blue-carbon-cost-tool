import { genSalt, hash } from "bcrypt";
import { DataSource, DeepPartial } from "typeorm";
import { User } from "@shared/entities/users/user.entity";
import {
  ACTIVITY,
  BaseData,
  ECOSYSTEM,
} from "@shared/entities/base-data.entity";
import {
  Project,
  PROJECT_PRICE_TYPE,
  PROJECT_SIZE_FILTER,
} from "@shared/entities/projects.entity";
import { Country } from "@shared/entities/country.entity";

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

  return dataSource
    .getRepository(BaseData)
    .save({ ...baseData, ...additionalData });
};

export const createProject = async (
  dataSource: DataSource,
  additionalData?: DeepPartial<Project>,
): Promise<Project> => {
  const countries = await dataSource.getRepository(Country).find();
  if (!countries.length) {
    throw new Error("No countries in the database");
  }
  const defaultProjectData: Partial<Project> = {
    projectName: "Test Project" + Math.random().toString(36).substring(7),
    countryCode: countries[0].code,
    activity: ACTIVITY.CONSERVATION,
    ecosystem: ECOSYSTEM.MANGROVE,
    activitySubtype: "Planting",
    projectSize: 100,
    projectSizeFilter: PROJECT_SIZE_FILTER.LARGE,
    abatementPotential: 100,
    totalCostNPV: 100,
    totalCost: 100,
    costPerTCO2eNPV: 100,
    costPerTCO2e: 100,
    initialPriceAssumption: "$100",
    priceType: PROJECT_PRICE_TYPE.MARKET_PRICE,
  };

  return dataSource
    .getRepository(Project)
    .save({ ...defaultProjectData, ...additionalData });
};

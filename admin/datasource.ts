import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { Country } from "@api/modules/model/entities/country.entity.js";
import { CarbonInputEntity } from "@api/modules/model/entities/carbon-input.entity.js";
import { CostInput } from "@api/modules/model/entities/cost-input.entity.js";

// TODO: If we go with this, it might be better to share the datasource with the api

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  username: "blue-carbon-cost",
  password: "blue-carbon-cost",
  database: "blc",
  entities: [User, Country, CarbonInputEntity, CostInput],
  synchronize: false,
});

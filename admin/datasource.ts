import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { Country } from "@api/modules/model/entities/country.entity.js";
import { BaseData } from "@api/modules/model/base-data.entity.js";
import { ProjectSize } from "@api/modules/model/entities/project-size.entity.js";

// TODO: If we go with this, it might be better to share the datasource with the api

export const ADMINJS_ENTITIES = [User, Country, ProjectSize, BaseData];

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME || "blue-carbon-cost",
  password: process.env.DB_PASSWORD || "blue-carbon-cost",
  database: process.env.DB_NAME || "blc",
  // TODO: Use common db entities from shared
  entities: ADMINJS_ENTITIES,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

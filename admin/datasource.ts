import { DataSource } from "typeorm";
import { DB_ENTITIES } from "@shared/lib/db-entities.js";

// TODO: If we go with this, it might be better to share the datasource with the api

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USERNAME || "blue-carbon-cost",
  password: process.env.DB_PASSWORD || "blue-carbon-cost",
  database: process.env.DB_NAME || "blc",
  // TODO: Use common db entities from shared
  entities: DB_ENTITIES,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

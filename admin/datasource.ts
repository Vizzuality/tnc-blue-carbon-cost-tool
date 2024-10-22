import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { ProjectSize } from "@shared/entities/project-size.entity.js";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity.js";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity.js";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity.js";

// TODO: If we import the COMMON_DATABASE_ENTITIES from shared, we get an error where DataSouce is not set for a given entity
export const ADMINJS_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  ProjectSize,
  FeasibilityAnalysis,
  ConservationPlanningAndAdmin,
  DataCollectionAndFieldCosts,
];

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

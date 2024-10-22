import { DataSource } from "typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity.js";
import { Country } from "@api/modules/model/entities/country.entity.js";
import { BaseData } from "@api/modules/model/base-data.entity.js";
import { ProjectSize } from "@api/modules/model/entities/project-size.entity.js";
import { FeasibilityAnalysis } from "@api/modules/model/entities/feasability-analysis.entity.js";
import { ConservationPlanningAndAdmin } from "@api/modules/model/entities/conservation-and-planning-admin.entity.js";
import { DataCollectionAndFieldCosts } from "@api/modules/model/entities/data-collection-and-field-costs.entity.js";

// TODO: If we go with this, it might be better to share the datasource with the api, right now adminjs throws and error if we import the BACKEND_DB_ENTITIES
//       we need to fix this and have a single source of truth for the entities

const ENTITIES = [
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
  entities: ENTITIES,
  synchronize: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

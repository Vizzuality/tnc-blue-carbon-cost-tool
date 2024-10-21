import { User } from "@shared/entities/users/user.entity";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";
import { Country } from "@api/modules/model/entities/country.entity";
import { BaseData } from "@api/modules/model/base-data.entity";
import { ProjectSize } from "@api/modules/model/entities/project-size.entity";

export const DB_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  ProjectSize,
];

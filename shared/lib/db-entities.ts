import { User } from "@shared/entities/users/user.entity";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";
import { BaseData } from "@api/modules/model/base-data.entity";
import { CostInput } from "@api/modules/model/entities/cost-input.entity";
import { CarbonInputEntity } from "@api/modules/model/entities/carbon-input.entity";
import { Country } from "@shared/entities/countries/country.entity";

export const DB_ENTITIES = [
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  CostInput,
  CarbonInputEntity,
];

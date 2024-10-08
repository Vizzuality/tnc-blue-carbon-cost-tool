import { MixedList } from 'typeorm/common/MixedList';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { User } from "@shared/entities/users/user.entity";

export const DB_ENTITIES: MixedList<Function | string | EntitySchema> = [
  User,
];

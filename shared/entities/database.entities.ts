import { User } from "@shared/entities/users/user.entity";
import { Country } from "@shared/entities/country.entity";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity";
import { ProjectSize } from "@shared/entities/project-size.entity";
import { DataCollectionAndFieldCosts } from "@shared/entities/data-collection-and-field-costs.entity";
import { BaseData } from "@shared/entities/base-data.entity";
import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity";

export const COMMON_DATABASE_ENTITIES = [
  // User,
  // BaseData,
  // Country,
  // ConservationPlanningAndAdmin,
  // FeasibilityAnalysis,
  // ProjectSize,
  // DataCollectionAndFieldCosts,
  User,
  ApiEventsEntity,
  Country,
  BaseData,
  ProjectSize,
  FeasibilityAnalysis,
  ConservationPlanningAndAdmin,
  DataCollectionAndFieldCosts,
];

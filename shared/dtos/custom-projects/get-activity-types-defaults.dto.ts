import { GetActivityTypesDefaultsSchema } from "@shared/schemas/custom-projects/activity-types-defaults.schema";
import { z } from "zod";

export type GetActivityTypesDefaults = z.infer<
  typeof GetActivityTypesDefaultsSchema
>;

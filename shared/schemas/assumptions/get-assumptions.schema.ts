import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";

export const GetAssumptionsSchema = z.object({
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
});

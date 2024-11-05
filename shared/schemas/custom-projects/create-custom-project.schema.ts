import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";

/**
 * @description: WIP: Prototype for creating a custom project. This should include optional overrides for default assumptions, cost inputs etc
 */
export const CreateCustomProjectSchema = z.object({
  countryCode: z.string().min(3).max(3),
  name: z.string().min(3).max(255),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  // We need to include activity subtype here
});

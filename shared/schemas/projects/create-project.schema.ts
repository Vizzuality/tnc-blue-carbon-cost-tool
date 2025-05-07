import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { PROJECT_PRICE_TYPE } from "@shared/entities/projects.entity";
import { z } from "zod";


export const CreateProjectSchema = z.object({
  projectName: z
      .string()
      .min(3, { message: "Name must contain at least 3 characters." })
      .max(255, { message: "Name must be less than 255 characters" }),
  countryCode: z.string().min(3).max(3),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  projectSizeHa: z.number().nonnegative(),
  priceType: z.nativeEnum(PROJECT_PRICE_TYPE).optional(),
  initialCarbonPriceAssumption: z.number().nonnegative(),
  restorationActivity: z
      .nativeEnum(RESTORATION_ACTIVITY_SUBTYPE)
      .optional()
      .nullable(),
}).superRefine((data, ctx) => {
  if (data.activity === ACTIVITY.RESTORATION && !data.restorationActivity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "restorationActivity is required when activity is RESTORATION",
      path: ["restorationActivity"],
    });
  }
});

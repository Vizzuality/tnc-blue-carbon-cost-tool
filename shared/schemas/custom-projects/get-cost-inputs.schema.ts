import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";

export const GetDefaultCostInputsSchema = z
  .object({
    countryCode: z.string().min(3).max(3),
    ecosystem: z.nativeEnum(ECOSYSTEM),
    activity: z.nativeEnum(ACTIVITY),
    restorationActivity: z.nativeEnum(ECOSYSTEM).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.activity === ACTIVITY.CONSERVATION &&
      data.restorationActivity !== undefined
    ) {
      ctx.addIssue({
        path: ["restorationActivitySubtype"],
        message:
          "restorationActivitySubtype should not be defined when activity is CONSERVATION",
        code: z.ZodIssueCode.custom,
      });
    }
    if (
      data.activity === ACTIVITY.RESTORATION &&
      data.restorationActivity === undefined
    ) {
      ctx.addIssue({
        path: ["restorationActivitySubtype"],
        message:
          "restorationActivitySubtype is required when activity is RESTORATION",
        code: z.ZodIssueCode.custom,
      });
    }
  });

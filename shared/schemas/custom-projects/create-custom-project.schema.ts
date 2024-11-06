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

export enum LOSS_RATE_USED {
  NATIONAL_AVERAGE = "NATIONAL_AVERAGE",
  PROJECT_SPECIFIC = "PROJECT_SPECIFIC",
}

export const ConservationCustomProjectSchema = z
  .object({
    activity: z.literal(ACTIVITY.CONSERVATION),
    countryCode: z.string().min(3).max(3),
    ecosystem: z.nativeEnum(ECOSYSTEM),
    lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
    projectSpecificLossRate: z
      .number({ message: "Project Specific Loss Rate should be a message" })
      .negative({ message: "Project Specific Loss Rate should be negative" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    console.log("DATA", data);
    if (
      data.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC &&
      !data.projectSpecificLossRate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Project Specific Loss Rate is required when lossRateUsed is ${LOSS_RATE_USED.PROJECT_SPECIFIC}`,
      });
    }
    if (
      data.lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE &&
      data.projectSpecificLossRate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Project Specific Loss Rate should not be provided when lossRateUsed is ${LOSS_RATE_USED.NATIONAL_AVERAGE}`,
      });
    }
  });

// TODO: Work on having a conditionally validated schema based on multiple conditions

export const CombinedCustomProjectSchema = z.union([
  CreateCustomProjectSchema.extend({
    activity: z.literal(ACTIVITY.CONSERVATION),
  }).and(ConservationCustomProjectSchema),
  CreateCustomProjectSchema.extend({
    activity: z.literal(ACTIVITY.RESTORATION),
  }),
]);

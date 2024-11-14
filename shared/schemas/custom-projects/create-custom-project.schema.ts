import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { CARBON_REVENUES_TO_COVER} from "@shared/entities/custom-project.entity";

/**
 * @description: WIP: Prototype for creating a custom project. This should include optional overrides for default assumptions, cost inputs etc
 */

export const CreateCustomProjectSchema = z.object({
  countryCode: z.string().min(3).max(3),
  name: z.string().min(3).max(255),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  projectSize: z.number().positive(),
  carbonRevenuesToCover: z.nativeEnum(CARBON_REVENUES_TO_COVER),
  initialCarbonPriceAssumption: z.number().positive(),
  // We need to include activity subtype here
})

export enum LOSS_RATE_USED {
  NATIONAL_AVERAGE = "National average",
  PROJECT_SPECIFIC = "Project specific",
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
    // todo: delete me
    exclusiveConservationProp: z.number().optional(),
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

export const RestorationCustomProjectSchema = z
  .object({
    activity: z.literal(ACTIVITY.RESTORATION),
    countryCode: z.string().min(3).max(3),
    ecosystem: z.nativeEnum(ECOSYSTEM),
    lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
    projectSpecificLossRate: z
      .number({ message: "Project Specific Loss Rate should be a message" })
      .negative({ message: "Project Specific Loss Rate should be negative" })
      .optional(),
    // todo: delete me
    exclusiveRestorationProp: z.number().optional(),
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

// export const CombinedCustomProjectSchema = z.union([
//   CreateCustomProjectSchema.extend({
//     activity: z.literal(ACTIVITY.CONSERVATION),
//   }).and(ConservationCustomProjectSchema),
//   CreateCustomProjectSchema.extend({
//     activity: z.literal(ACTIVITY.RESTORATION),
//   }).and(RestorationCustomProjectSchema),
// ]);


export const CombinedCustomProjectSchema = CreateCustomProjectSchema.extend({
  activity: z.union([
    z.literal(ACTIVITY.CONSERVATION),
    z.literal(ACTIVITY.RESTORATION),
  ]),
}).superRefine((data, ctx) => {
  console.log(data, ctx)
  if (data.activity === ACTIVITY.CONSERVATION) {
    return CreateCustomProjectSchema.and(ConservationCustomProjectSchema).parse(data);
    // ConservationCustomProjectSchema.parse(data);
  } else if (data.activity === ACTIVITY.RESTORATION) {
    // RestorationCustomProjectSchema.parse(data);
    return CreateCustomProjectSchema.and(RestorationCustomProjectSchema).parse(data);
  }
});
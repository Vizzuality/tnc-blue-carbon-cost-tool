import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import {
  LOSS_RATE_USED,
  ValidateConservationSchema,
  ValidateRestorationSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

export const CreateProjectBaseSchema = z.object({
  projectName: z
    .string()
    .min(3, {
      message: "Name must contain at least 3 characters.",
    })
    .max(255, { message: "Name must be less than 255 characters" }),
  countryCode: z.string().min(3).max(3),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  carbonRevenuesToCover: z.nativeEnum(CARBON_REVENUES_TO_COVER),
  projectSizeHa: z.number().nonnegative(),
});

const parseNumber = (v: unknown) => Number(v);

const ConservationProjectSchema = z.object({
  lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  projectSpecificLossRate: z.preprocess(
    (value) =>
      value === undefined || value === null ? undefined : parseNumber(value),
    z
      .number({ message: "Project Specific Loss Rate should be a number" })
      .negative({ message: "Project Specific Loss Rate must be negative" })
      .optional(),
  ),
  emissionFactorUsed: z.nativeEnum(EMISSION_FACTORS_TIER_TYPES),
  projectSpecificEmission: z.nativeEnum(PROJECT_SPECIFIC_EMISSION),
  projectSpecificEmissionFactor: z
    .number({
      message:
        "Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor",
    })
    .nonnegative()
    .optional(),
  emissionFactorAGB: z
    .number({
      message:
        "Emission Factor AGB is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors",
    })
    .nonnegative()
    .optional(),
  emissionFactorSOC: z
    .number({
      message:
        "Emission Factor SOC is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors",
    })
    .nonnegative()
    .optional(),
});

const RestorationProjectSchema = z.object({
  restorationActivity: z.nativeEnum(RESTORATION_ACTIVITY_SUBTYPE),
  tierSelector: z.nativeEnum(SEQUESTRATION_RATE_TIER_TYPES),
  projectSpecificSequestrationRate: z
    .number({ message: "Project Specific Rate should be a number" })
    .positive({ message: "Project Specific Rate must be positive" })
    .optional(),
});

export const CreateProjectSchema = z
  .discriminatedUnion("activity", [
    z.object({
      ...CreateProjectBaseSchema.shape,
      activity: z.literal(ACTIVITY.CONSERVATION),
      parameters: ConservationProjectSchema,
    }),
    z.object({
      ...CreateProjectBaseSchema.shape,
      activity: z.literal(ACTIVITY.RESTORATION),
      parameters: RestorationProjectSchema,
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.activity === ACTIVITY.CONSERVATION) {
      ValidateConservationSchema(data, ctx);
    } else if (data.activity === ACTIVITY.RESTORATION) {
      ValidateRestorationSchema(data, ctx);
    }
  });

import {
  ACTIVITY, RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { z } from "zod";
import {CARBON_REVENUES_TO_COVER, PROJECT_SPECIFIC_EMISSION} from "@shared/entities/custom-project.entity";
import {EMISSION_FACTORS_TIER_TYPES} from "@shared/entities/carbon-inputs/emission-factors.entity";
import {SEQUESTRATION_RATE_TIER_TYPES} from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import {
  ConservationCustomProjectSchema,
   LOSS_RATE_USED, RestorationCustomProjectSchema
} from "@shared/schemas/custom-projects/create-custom-project.schema";


// TODO: This is a partial replica of the custom project schema due to time constraints, we should refactor this at some point

export const CreateProjectBaseSchema = z.object({
  countryCode: z.string().min(3).max(3),
  projectName: z
      .string()
      .min(3, {
        message: "Name must contain at least 3 characters.",
      })
      .max(255, { message: "Name must be less than 255 characters" }),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  projectSizeHa: z.number().nonnegative(),
  carbonRevenuesToCover: z.nativeEnum(CARBON_REVENUES_TO_COVER),
  initialCarbonPriceAssumption: z.number().nonnegative(),
});


const parseNumber = (v: unknown) => Number(v);

export const ConservationProjectSchema = z.object({
  lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  emissionFactorUsed: z.nativeEnum(EMISSION_FACTORS_TIER_TYPES),
  projectSpecificEmission: z.nativeEnum(PROJECT_SPECIFIC_EMISSION).optional(),
  projectSpecificLossRate: z.preprocess(
      (value) =>
          value === undefined || value === null ? undefined : parseNumber(value),
      z
          .number({ message: "Project Specific Loss Rate should be a number" })
          .negative({ message: "Project Specific Loss Rate must be negative" })
          .optional(),
  ),
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

export const RestorationProjectSchema = z.object({
  restorationActivity: z.nativeEnum(RESTORATION_ACTIVITY_SUBTYPE, {message: 'Restoration Activity is required for Restoration Projects'}),
  tierSelector: z.nativeEnum(SEQUESTRATION_RATE_TIER_TYPES),
  projectSpecificSequestrationRate: z
      .number({ message: "Project Specific Rate should be a number" })
      .positive({ message: "Project Specific Rate must be positive" })
      .optional(),
  plantingSuccessRate: z.preprocess(
      parseNumber,
      z.number().nonnegative({
        message: "Planting Success Rate should be a non-negative number",
      }),
  ).optional(),
  restorationYearlyBreakdown: z
      .array(z.preprocess(parseNumber, z.number()).optional())
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


export const ValidateConservationSchema = (
    data: z.infer<typeof CreateProjectSchema>,
    ctx: z.RefinementCtx,
) => {
  const params = data.parameters as z.infer<
      typeof ConservationProjectSchema
  >;
  if (params.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
    if (!params.projectSpecificLossRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project Specific Loss Rate is required when loss rate used is Project Specific",
        path: ["parameters.projectSpecificLossRate"],
      });
    }
  } else {
    if (params.projectSpecificLossRate !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
            "projectSpecificLossRate should not be provided unless lossRateUsed is Project Specific",
        path: ["parameters.projectSpecificLossRate"],
      });
    }
  }


  if (params.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2) {
    if (data.ecosystem !== ECOSYSTEM.MANGROVE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "There is only Tier 2 emission factor for Mangrove ecosystems",
        path: ["parameters.emissionFactorUsed"],
      });
    }
    if(!params.emissionFactorSOC || !params.emissionFactorAGB){
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Emission Factor AGB and SOC are required when emissionFactorUsed is Tier 2",
        path: ["parameters.emissionFactorAGB", "parameters.emissionFactorSOC"],
      });
    }
  } else if (params.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_3) {
    if (
        params.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR &&
        !params.projectSpecificEmissionFactor
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
            "Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor",
        path: ["parameters.projectSpecificEmissionFactor"],
      });
    }

    if (
        params.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS
    ) {
      if (!params.emissionFactorAGB) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
              "Emission Factor AGB is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors",
          path: ["parameters.emissionFactorAGB"],
        });
      }

      if (!params.emissionFactorSOC) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
              "Emission Factor SOC is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors",
          path: ["parameters.emissionFactorSOC"],
        });
      }
    }
  }
};

// Complex validations that depend on multiple fields
export const ValidateRestorationSchema = (
    data: z.infer<typeof CreateProjectSchema>,
    ctx: z.RefinementCtx,
) => {
  const params = data.parameters as z.infer<
      typeof RestorationProjectSchema
  >;
  if (
      params.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_3 &&
      !params.projectSpecificSequestrationRate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Project Specific Rate is required for Tier 3 Sequestration rate",
      path: ["parameters.projectSpecificSequestrationRate"],
    });
  }
};



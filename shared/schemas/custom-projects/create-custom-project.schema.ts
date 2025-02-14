import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  PROJECT_SPECIFIC_EMISSION,
  CARBON_REVENUES_TO_COVER,
} from "@shared/entities/custom-project.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";

export const MAX_PROJECT_LENGTH = 40;
export enum LOSS_RATE_USED {
  NATIONAL_AVERAGE = "National average",
  PROJECT_SPECIFIC = "Project specific",
}

const parseNumber = (v: unknown) => Number(v);

export const ConservationCustomProjectSchema = z.object({
  lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  emissionFactorUsed: z.nativeEnum(EMISSION_FACTORS_TIER_TYPES),
  projectSpecificEmission: z.nativeEnum(PROJECT_SPECIFIC_EMISSION),
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

export const RestorationCustomProjectSchema = z.object({
  restorationActivity: z.nativeEnum(RESTORATION_ACTIVITY_SUBTYPE),
  tierSelector: z.nativeEnum(SEQUESTRATION_RATE_TIER_TYPES),
  projectSpecificSequestrationRate: z
    .number({ message: "Project Specific Rate should be a number" })
    .positive({ message: "Project Specific Rate must be positive" })
    .optional(),
  // lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  plantingSuccessRate: z.preprocess(
    parseNumber,
    z.number().nonnegative({
      message: "Planting Success Rate should be a non-negative number",
    }),
  ),
  restorationYearlyBreakdown: z
    .array(z.preprocess(parseNumber, z.number()).optional())
    .optional(),
});

export const AssumptionsSchema = z.object({
  verificationFrequency: z
    .preprocess(parseNumber, z.number().positive())
    .optional(),
  baselineReassessmentFrequency: z
    .preprocess(parseNumber, z.number().positive())
    .optional(),
  discountRate: z.preprocess(parseNumber, z.number().positive()).optional(),
  restorationRate: z.preprocess(parseNumber, z.number().positive()).optional(),
  carbonPriceIncrease: z
    .preprocess(parseNumber, z.number().positive())
    .optional(),
  buffer: z.preprocess(parseNumber, z.number().positive()).optional(),
  projectLength: z
    .preprocess(
      parseNumber,
      z
        .number()
        .positive()
        .min(1)
        .max(MAX_PROJECT_LENGTH, {
          message: `Project Length should be between 1 and ${MAX_PROJECT_LENGTH} years`,
        }),
    )
    .optional(),
});

export const InputCostsSchema = z.object({
  // capex
  feasibilityAnalysis: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  conservationPlanningAndAdmin: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  dataCollectionAndFieldCost: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  communityRepresentation: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  blueCarbonProjectPlanning: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  establishingCarbonRights: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  validation: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  implementationLabor: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  // opex
  monitoring: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  maintenance: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  communityBenefitSharingFund: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  carbonStandardFees: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  baselineReassessment: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  mrv: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  longTermProjectOperatingCost: z
    .preprocess(parseNumber, z.number().nonnegative())
    .optional(),
  // other
  financingCost: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
});

export const CustomProjectBaseSchema = z.object({
  countryCode: z.string().min(3).max(3),
  projectName: z.string().min(3).max(255),
  ecosystem: z.nativeEnum(ECOSYSTEM),
  activity: z.nativeEnum(ACTIVITY),
  projectSizeHa: z.number().nonnegative(),
  carbonRevenuesToCover: z.nativeEnum(CARBON_REVENUES_TO_COVER),
  initialCarbonPriceAssumption: z.number().nonnegative(),
  assumptions: AssumptionsSchema.optional(),
  costInputs: InputCostsSchema.optional(),
});

export const CreateCustomProjectSchema = z
  .discriminatedUnion("activity", [
    z.object({
      ...CustomProjectBaseSchema.shape,
      activity: z.literal(ACTIVITY.CONSERVATION),
      parameters: ConservationCustomProjectSchema,
    }),
    z.object({
      ...CustomProjectBaseSchema.shape,
      activity: z.literal(ACTIVITY.RESTORATION),
      parameters: RestorationCustomProjectSchema,
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.activity === ACTIVITY.CONSERVATION) {
      ValidateConservationSchema(data, ctx);
    } else if (data.activity === ACTIVITY.RESTORATION) {
      ValidateRestorationSchema(data, ctx);
    }
  });

// Complex validations that depend on multiple fields
const ValidateConservationSchema = (
  data: z.infer<typeof CreateCustomProjectSchema>,
  ctx: z.RefinementCtx,
) => {
  const params = data.parameters as z.infer<
    typeof ConservationCustomProjectSchema
  >;
  if (params.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
    if (!params.projectSpecificLossRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "projectSpecificLossRate is required when lossRateUsed is projectSpecific",
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
const ValidateRestorationSchema = (
  data: z.infer<typeof CreateCustomProjectSchema>,
  ctx: z.RefinementCtx,
) => {
  const params = data.parameters as z.infer<
    typeof RestorationCustomProjectSchema
  >;
  if (
    params.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_3 &&
    !params.projectSpecificSequestrationRate
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Project Specific Rate is required",
      path: ["parameters.projectSpecificSequestrationRate"],
    });
  }
};

import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY, RESTORATION_ACTIVITY_SUBTYPE } from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { CARBON_REVENUES_TO_COVER, PROJECT_SPECIFIC_EMISSION } from "@shared/entities/custom-project.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";
import { isNumber } from "lodash";

export const MAX_PROJECT_LENGTH = 40;

export enum LOSS_RATE_USED {
  NATIONAL_AVERAGE = "National average",
  PROJECT_SPECIFIC = "Project specific",
}

const parseNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return isNaN(parsed) || !isNumber(parsed) ? undefined : parsed;
};

export const ConservationCustomProjectSchema = z.object({
  lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  emissionFactorUsed: z.nativeEnum(EMISSION_FACTORS_TIER_TYPES),
  projectSpecificEmission: z.nativeEnum(PROJECT_SPECIFIC_EMISSION),
  projectSpecificLossRate: z.preprocess(
      (value) =>
          value === undefined || value === null ? undefined : parseNumber(value),
      z
          .number({
            required_error: "Project Specific Loss Rate is required",
            invalid_type_error: "Project Specific Loss Rate should be a number",
          })
          .refine(
              (val) => val >= -1 && val <= 0,
              {
                message: "Project Specific Loss Rate must be between -100% and 0%",
              }
          ).optional(),
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

export const ConservationCustomProjectSchemaFE = ConservationCustomProjectSchema.extend({
  projectSpecificLossRate: z.preprocess(
    (value) =>
      value === undefined || value === null
        ? undefined
        : parseNumber(value),
    z
      .number({
        required_error: "Project Specific Loss Rate is required",
        invalid_type_error: "Project Specific Loss Rate should be a number",
      })
      .refine((val) => val >= -100 && val <= 0, {
        message: "Project Specific Loss Rate must be between -100 and 0",
      })
      .transform((val) => val / 100)
      .optional(),
  ),
});

export const RestorationPlanDTOSchema = z
  .array(
    z.object({
      year: z
        .preprocess(
          parseNumber,
          z.number({
            required_error: "Year should be a number",
            invalid_type_error: "Year must be a number",
          })
            .int("Year must be an integer"),
        )
        .optional(),

      annualHectaresRestored: z
        .preprocess(
          parseNumber,
          z.number({
            required_error: "Annual hectares restored should be a number",
            invalid_type_error: "Annual hectares restored must be a number",
          }).nonnegative("Annual hectares restored cannot be negative"),
        )
        .optional(),
    }),
  )
  .optional();

export const RestorationCustomProjectSchema = z.object({
  restorationActivity: z.nativeEnum(RESTORATION_ACTIVITY_SUBTYPE),
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
  ),
  // sharing the custom restoration plan DTO among client and API requires a lot of changes,
  // so we are keeping it as a separate schema for now: customRestorationPlan is used by the API
  // and restorationYearlyBreakdown is used by the client, eventually parsed as customRestorationPlan
  // before sending it to the API
  customRestorationPlan: RestorationPlanDTOSchema,
  restorationYearlyBreakdown: z
    .array(z.preprocess(parseNumber, z.number()).optional())
    .optional(),
});

export const AssumptionsSchema = z.object({
  verificationFrequency: z.preprocess(parseNumber, z.number().positive()),
  baselineReassessmentFrequency: z.preprocess(
    parseNumber,
    z.number().positive(),
  ),
  discountRate: z.preprocess(parseNumber, z.number().positive()),
  restorationRate: z.preprocess(parseNumber, z.number().positive()).optional(),
  carbonPriceIncrease: z.preprocess(parseNumber, z.number().positive()),
  buffer: z.preprocess(parseNumber, z.number().positive()),
  projectLength: z.preprocess(
    parseNumber,
    z
      .number()
      .positive()
      .min(1)
      .max(MAX_PROJECT_LENGTH, {
        message: `Project Length should be between 1 and ${MAX_PROJECT_LENGTH} years`,
      }),
  ),
});

export const InputCostsSchema = z.object({
  // capex
  feasibilityAnalysis: z.preprocess(parseNumber, z.number().nonnegative()),
  conservationPlanningAndAdmin: z.preprocess(
    parseNumber,
    z.number().nonnegative(),
  ),
  dataCollectionAndFieldCost: z.preprocess(
    parseNumber,
    z.number().nonnegative(),
  ),
  communityRepresentation: z.preprocess(parseNumber, z.number().nonnegative()),
  blueCarbonProjectPlanning: z.preprocess(
    parseNumber,
    z.number().nonnegative(),
  ),
  establishingCarbonRights: z.preprocess(parseNumber, z.number().nonnegative()),
  validation: z.preprocess(parseNumber, z.number().nonnegative()),
  implementationLabor: z.preprocess(parseNumber, z.number().nonnegative()),
  // opex
  monitoring: z.preprocess(parseNumber, z.number().nonnegative()),
  maintenance: z.preprocess(parseNumber, z.number().nonnegative()),
  communityBenefitSharingFund: z.preprocess(
    parseNumber,
    z.number().nonnegative(),
  ),
  carbonStandardFees: z.preprocess(parseNumber, z.number().nonnegative()),
  baselineReassessment: z.preprocess(parseNumber, z.number().nonnegative()),
  mrv: z.preprocess(parseNumber, z.number().nonnegative()),
  longTermProjectOperatingCost: z.preprocess(
    parseNumber,
    z.number().nonnegative(),
  ),
  // other
  financingCost: z.preprocess(parseNumber, z.number().nonnegative()),
});

export const CustomProjectBaseSchema = z.object({
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
  assumptions: AssumptionsSchema,
  costInputs: InputCostsSchema,
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

    ValidateAssumptionsSchema(data, ctx);
  });

export const CreateCustomProjectSchemaFE = z
  .discriminatedUnion("activity", [
    z.object({
      ...CustomProjectBaseSchema.shape,
      activity: z.literal(ACTIVITY.CONSERVATION),
      parameters: ConservationCustomProjectSchemaFE,
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

    ValidateAssumptionsSchema(data, ctx);
  });

export const CustomProjectBaseLooseSchema = CustomProjectBaseSchema.extend({
  assumptions: AssumptionsSchema.partial().optional(),
  costInputs: InputCostsSchema.partial().optional(),
});

// Complex validations that depend on multiple fields
export const ValidateConservationSchema = (
  data: z.infer<typeof CreateCustomProjectSchema>,
  ctx: z.RefinementCtx,
) => {
  const params = data.parameters as z.infer<
    typeof ConservationCustomProjectSchema
  >;
  if (params.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
    if (params.projectSpecificLossRate === undefined || params.projectSpecificLossRate === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project Specific Loss Rate must be between -100% and 0%",
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

const ValidateAssumptionsSchema = (
  data: z.infer<typeof CreateCustomProjectSchema>,
  ctx: z.RefinementCtx,
) => {
  const { activity, assumptions } = data;
  if (activity === ACTIVITY.RESTORATION) {
    if (!assumptions.restorationRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Restoration Rate should be provided for Restoration projects",
        path: ["assumptions.restorationRate"],
      });
    }
  } else if (activity === ACTIVITY.CONSERVATION) {
    if (assumptions.restorationRate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Restoration Rate should not be provided for Conservation projects",
        path: ["assumptions.restorationRate"],
      });
    }
  }
};

export type ValidatedCustomProjectForm = z.infer<
  typeof CreateCustomProjectSchema
>;

export type ValidatedCustomProjectFormFE = z.infer<
  typeof CreateCustomProjectSchemaFE
>;

export type CustomProjectForm = Omit<
  ValidatedCustomProjectFormFE,
  "costInputs" | "assumptions"
> & {
  costInputs?: {
    [K in keyof ValidatedCustomProjectForm["costInputs"]]: number | undefined;
  };
  assumptions?: {
    [K in keyof ValidatedCustomProjectForm["assumptions"]]: number | undefined;
  };
};

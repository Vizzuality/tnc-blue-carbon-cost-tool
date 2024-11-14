import { z } from "zod";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY, RESTORATION_ACTIVITY_SUBTYPE } from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import { PROJECT_SPECIFIC_EMISSION, CARBON_REVENUES_TO_COVER } from "@shared/entities/custom-project.entity";
import { SEQUESTRATION_RATE_TIER_TYPES } from "@shared/entities/carbon-inputs/sequestration-rate.entity";

export enum LOSS_RATE_USED {
  NATIONAL_AVERAGE = "National average",
  PROJECT_SPECIFIC = "Project specific",
}

const parseNumber = (v: unknown) => Number(v);

export const ConservationCustomProjectSchema = z
  .object({
    lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
    emissionFactorUsed: z.nativeEnum(EMISSION_FACTORS_TIER_TYPES),
    projectSpecificEmission: z.nativeEnum(PROJECT_SPECIFIC_EMISSION),
    projectSpecificLossRate: z.preprocess(parseNumber, z.number().negative()),
    projectSpecificEmissionFactor: z.number().nonnegative(),
    emissionFactorAGB: z.number().nonnegative(),
    emissionFactorSOC: z.number().nonnegative(),
  })
  .superRefine((data, ctx) => {
    if (data.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_3) {
      if (data.projectSpecificEmission === PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR && !data.projectSpecificEmissionFactor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Project Specific Emission Factor is required when the emission factor used is Tier 3.',
          path: ["projectSpecificEmissionFactor"],
        });
      }

      if (data.projectSpecificEmission === PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS) {
        if (!data.emissionFactorAGB) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'AGB Emission Factor is required.',
            path: ["emissionFactorAGB"],
          });
        }

        if (!data.emissionFactorSOC) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'SOC Emission Factor is required.',
            path: ["emissionFactorSOC"],
          });
        }
      }
    }
  });

export const RestorationCustomProjectSchema = z
  .object({
    restorationActivity: z.nativeEnum(RESTORATION_ACTIVITY_SUBTYPE),
    tierSelector: z.nativeEnum(SEQUESTRATION_RATE_TIER_TYPES),
    projectSpecificLossRate: z
      .number({ message: "Project Specific Loss Rate should be a message" })
      .negative({ message: "Project Specific Loss Rate should be negative" }),
    lossRateUsed: z.nativeEnum(LOSS_RATE_USED),
  })
  .superRefine((data, ctx) => {
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

export const AssumptionsSchema = z.object({
  verificationFrequency: z.preprocess(parseNumber, z.number().positive()).optional(),
  baselineReassessmentFrequency: z.preprocess(parseNumber, z.number().positive()).optional(),
  discountRate: z.preprocess(parseNumber, z.number().positive()).optional(),
  restorationRate: z.preprocess(parseNumber, z.number().positive()).optional(),
  carbonPriceIncrease: z.preprocess(parseNumber, z.number().positive()).optional(),
  buffer: z.preprocess(parseNumber, z.number().positive()).optional(),
  projectLength: z.preprocess(parseNumber, z.number().positive()).optional(),
});

export const InputCostsSchema = z.object({
  // capex
  feasibilityAnalysis: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  conservationPlanningAndAdmin: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  dataCollectionAndFieldCost: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  communityRepresentation: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  blueCarbonProjectPlanning: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  establishingCarbonRights: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  validation: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  implementationLabor: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  // opex
  monitoring: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  maintenance: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  communityBenefitSharingFund: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  carbonStandardFees: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  baselineReassessment: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  mrv: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  longTermProjectOperatingCost: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
  // other
  financingCost: z.preprocess(parseNumber, z.number().nonnegative()).optional(),
})

export const CreateCustomProjectBaseSchema = z.object({
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

export const CreateCustomProjectSchema = z.discriminatedUnion("activity", [
  z.object({ ...CreateCustomProjectBaseSchema.shape, activity: z.literal(ACTIVITY.CONSERVATION), parameters: ConservationCustomProjectSchema }),
  z.object({ ...CreateCustomProjectBaseSchema.shape, activity: z.literal(ACTIVITY.RESTORATION), parameters: RestorationCustomProjectSchema }),
]);
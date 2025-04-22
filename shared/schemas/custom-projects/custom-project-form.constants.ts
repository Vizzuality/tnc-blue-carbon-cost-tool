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
  ConservationCustomProjectSchema,
  CustomProjectForm,
  LOSS_RATE_USED,
  RestorationCustomProjectSchema,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { z } from "zod";

export const DEFAULT_COMMON_FORM_VALUES: Omit<
  CustomProjectForm,
  "activity" | "projectSizeHa" | "parameters"
> = {
  projectName: "",
  ecosystem: ECOSYSTEM.SEAGRASS,
  countryCode: "",
  initialCarbonPriceAssumption: 0,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  assumptions: {
    baselineReassessmentFrequency: undefined,
    buffer: undefined,
    carbonPriceIncrease: undefined,
    discountRate: undefined,
    projectLength: undefined,
    restorationRate: undefined,
    verificationFrequency: undefined,
  },
};

export const DEFAULT_CONSERVATION_FORM_VALUES: Pick<
  CustomProjectForm,
  "activity" | "projectSizeHa"
> & {
  parameters: z.infer<typeof ConservationCustomProjectSchema>;
} = {
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 10000,
  parameters: {
    projectSpecificEmissionFactor: 15,
    emissionFactorAGB: 200,
    emissionFactorSOC: 15,
    lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
    emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
    projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
  },
};

export const DEFAULT_RESTORATION_FORM_VALUES: Pick<
  CustomProjectForm,
  "activity" | "projectSizeHa"
> & {
  parameters: Pick<
    z.infer<typeof RestorationCustomProjectSchema>,
    | "restorationActivity"
    | "tierSelector"
    | "plantingSuccessRate"
    | "projectSpecificSequestrationRate"
    | "restorationYearlyBreakdown"
  >;
} = {
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 100,
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
    plantingSuccessRate: 0.6,
    projectSpecificSequestrationRate: 15,
    restorationYearlyBreakdown: [],
  },
};

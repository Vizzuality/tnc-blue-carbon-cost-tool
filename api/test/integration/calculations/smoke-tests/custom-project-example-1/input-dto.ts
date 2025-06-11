import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'CHN',
  projectName: 'Custom project (Example 1)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 500,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.CAPEX_AND_OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    restorationRate: 250,
    projectLength: 20,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 2867,
    feasibilityAnalysis: 50000,
    conservationPlanningAndAdmin: 20000,
    dataCollectionAndFieldCost: 0,
    communityRepresentation: 0,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 20000,
    maintenance: 0.05,
    communityBenefitSharingFund: 0.2,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 50000,
    longTermProjectOperatingCost: 50900,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_2,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 0.6,
    customRestorationPlan: [
      {
        year: -1,
        annualHectaresRestored: 100,
      },
      {
        year: 1,
        annualHectaresRestored: 100,
      },
      {
        year: 2,
        annualHectaresRestored: 100,
      },
      {
        year: 3,
        annualHectaresRestored: 100,
      },
      {
        year: 4,
        annualHectaresRestored: 100,
      },
    ],
  },
};

import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'USA',
  projectName: 'Custom project (Example 7)',
  ecosystem: ECOSYSTEM.SALT_MARSH,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 230,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.25,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    projectLength: 20,
    restorationRate: 250,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 5000,
    feasibilityAnalysis: 100000,
    conservationPlanningAndAdmin: 166766.666666667,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 126500,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 42850,
    maintenance: 0,
    communityBenefitSharingFund: 0,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 100000,
    longTermProjectOperatingCost: 130600,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 1.1,
    customRestorationPlan: [
      {
        year: 1,
        annualHectaresRestored: 50,
      },
      {
        year: 2,
        annualHectaresRestored: 100,
      },
      {
        year: 3,
        annualHectaresRestored: 80,
      },
    ],
  },
};

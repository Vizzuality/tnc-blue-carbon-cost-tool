import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'MEX',
  projectName: 'Custom project (Example 6)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 1200,
  carbonRevenuesToCover: 'Capex and Opex' as CARBON_REVENUES_TO_COVER,
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
    implementationLabor: 500,
    feasibilityAnalysis: 0,
    conservationPlanningAndAdmin: 166766.666666667,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 72600,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 15000,
    validation: 50000,
    monitoring: 11900,
    maintenance: 0.2,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 30000,
    longTermProjectOperatingCost: 31300,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_2,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 0.8,
    customRestorationPlan: [
      {
        year: 1,
        annualHectaresRestored: 50,
      },
      {
        year: 2,
        annualHectaresRestored: 150,
      },
      {
        year: 3,
        annualHectaresRestored: 300,
      },
      {
        year: 4,
        annualHectaresRestored: 500,
      },
      {
        year: 5,
        annualHectaresRestored: 200,
      },
    ],
  },
};

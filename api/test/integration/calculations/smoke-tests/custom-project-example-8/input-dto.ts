import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'BHS',
  projectName: 'custom-project-example-8',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 1000,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    restorationRate: 250,
    projectLength: 30,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 26645,
    feasibilityAnalysis: 30000,
    conservationPlanningAndAdmin: 50000,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 30000,
    blueCarbonProjectPlanning: 125000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 50000,
    maintenance: 0,
    communityBenefitSharingFund: 0.2,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 50000,
    longTermProjectOperatingCost: 30000,
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
        annualHectaresRestored: 10,
      },
      {
        year: 1,
        annualHectaresRestored: 20,
      },
      {
        year: 2,
        annualHectaresRestored: 20,
      },
      {
        year: 3,
        annualHectaresRestored: 50,
      },
      {
        year: 4,
        annualHectaresRestored: 100,
      },
      {
        year: 5,
        annualHectaresRestored: 100,
      },
      {
        year: 6,
        annualHectaresRestored: 100,
      },
      {
        year: 7,
        annualHectaresRestored: 200,
      },
      {
        year: 8,
        annualHectaresRestored: 200,
      },
      {
        year: 9,
        annualHectaresRestored: 200,
      },
    ],
  },
};

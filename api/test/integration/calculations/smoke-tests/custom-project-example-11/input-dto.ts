import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'COL',
  projectName: 'Custom project (Example 11)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 800,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
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
    implementationLabor: 4497,
    feasibilityAnalysis: 20000,
    conservationPlanningAndAdmin: 50000,
    dataCollectionAndFieldCost: 30000,
    communityRepresentation: 50000,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 43333.3333333333,
    validation: 50000,
    monitoring: 6500,
    maintenance: 0.0833,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 75000,
    longTermProjectOperatingCost: 17000,
    financingCost: 0.02,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
    projectSpecificSequestrationRate: 25,
    plantingSuccessRate: 0.6,
    customRestorationPlan: [],
  },
};

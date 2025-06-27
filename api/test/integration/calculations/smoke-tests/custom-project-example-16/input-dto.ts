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
  projectName: 'Custom project (Example 16)',
  ecosystem: ECOSYSTEM.SEAGRASS,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 600,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    projectLength: 20,
    restorationRate: 100,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 5000,
    feasibilityAnalysis: 50000,
    conservationPlanningAndAdmin: 166766.666666667,
    dataCollectionAndFieldCost: 0,
    communityRepresentation: 0,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 19400,
    maintenance: 0,
    communityBenefitSharingFund: 0,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 75000,
    longTermProjectOperatingCost: 50900,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
    projectSpecificSequestrationRate: 2,
    plantingSuccessRate: 0.7,
    customRestorationPlan: [],
  },
};

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
  projectName: 'Custom project (Example 13)',
  ecosystem: ECOSYSTEM.SALT_MARSH,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 300,
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
    implementationLabor: 189774.103740188,
    feasibilityAnalysis: 100000,
    conservationPlanningAndAdmin: 100000,
    dataCollectionAndFieldCost: 15000,
    communityRepresentation: 10000,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 42850,
    maintenance: 0.02,
    communityBenefitSharingFund: 0,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 50000,
    longTermProjectOperatingCost: 15000,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
    projectSpecificSequestrationRate: 8,
    plantingSuccessRate: 0.8,
    customRestorationPlan: [],
  },
};

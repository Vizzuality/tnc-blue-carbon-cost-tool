import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'AUS',
  projectName: 'Custom project (Example 9)',
  ecosystem: ECOSYSTEM.SALT_MARSH,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 250,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    projectLength: 20,
    restorationRate: 250,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 22386.3321533015,
    feasibilityAnalysis: 30000,
    conservationPlanningAndAdmin: 166766.666666667,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 30000,
    blueCarbonProjectPlanning: 80000,
    establishingCarbonRights: 50000,
    validation: 50000,
    monitoring: 5000,
    maintenance: 0.0833,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 15000,
    longTermProjectOperatingCost: 20000,
    financingCost: 0.05,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.HYDROLOGY,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 0.6,
    customRestorationPlan: [],
  },
};

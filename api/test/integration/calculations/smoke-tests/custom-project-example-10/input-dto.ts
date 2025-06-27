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
  projectName: 'Custom project (Example 10)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 500,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    discountRate: 0.04,
    restorationRate: 50,
    projectLength: 20,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 26645,
    feasibilityAnalysis: 70000,
    conservationPlanningAndAdmin: 50000,
    dataCollectionAndFieldCost: 30000,
    communityRepresentation: 10000,
    blueCarbonProjectPlanning: 125000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 10000,
    maintenance: 0.03,
    communityBenefitSharingFund: 0.15,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 50000,
    longTermProjectOperatingCost: 87500,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
    tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_1,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 0.6,
    customRestorationPlan: [],
  },
};

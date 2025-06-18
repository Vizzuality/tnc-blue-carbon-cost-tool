import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'IND',
  projectName: 'Custom project (Example 4)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.RESTORATION,
  projectSizeHa: 800,
  carbonRevenuesToCover: 'Opex' as CARBON_REVENUES_TO_COVER,
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
    implementationLabor: 1000,
    feasibilityAnalysis: 50000,
    conservationPlanningAndAdmin: 100000,
    dataCollectionAndFieldCost: 30000,
    communityRepresentation: 10000,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 1000,
    maintenance: 0.0833,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 50000,
    longTermProjectOperatingCost: 15000,
    financingCost: 0,
  },
  parameters: {
    restorationActivity: 'Planting' as RESTORATION_ACTIVITY_SUBTYPE,
    tierSelector:
      'Tier 2 - Country-specific rate' as SEQUESTRATION_RATE_TIER_TYPES,
    projectSpecificSequestrationRate: 15,
    plantingSuccessRate: 0.6,
    customRestorationPlan: [],
  },
};

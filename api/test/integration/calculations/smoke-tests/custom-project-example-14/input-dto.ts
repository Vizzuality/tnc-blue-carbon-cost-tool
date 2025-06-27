import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'MEX',
  projectName: 'Custom project (Example 14)',
  ecosystem: ECOSYSTEM.SALT_MARSH,
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 1200,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.CAPEX_AND_OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.2,
    carbonPriceIncrease: 0.015,
    projectLength: 20,
    discountRate: 0.04,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 0,
    feasibilityAnalysis: 0,
    conservationPlanningAndAdmin: 30000,
    dataCollectionAndFieldCost: 0,
    communityRepresentation: 30000,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 15000,
    validation: 50000,
    monitoring: 11900,
    maintenance: 0.05,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 30000,
    longTermProjectOperatingCost: 10000,
    financingCost: 0.025,
  },
  parameters: {
    lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
    emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_3,
    projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
    projectSpecificLossRate: -0.015,
    projectSpecificEmissionFactor: 15,
    emissionFactorAGB: 460,
    emissionFactorSOC: 72,
  },
};

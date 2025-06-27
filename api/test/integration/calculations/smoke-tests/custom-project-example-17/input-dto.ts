import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';

export const inputDto: CreateCustomProjectDto = {
  countryCode: 'BHS',
  projectName: 'Custom project (Example 17)',
  ecosystem: ECOSYSTEM.SEAGRASS,
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 600,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
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
    feasibilityAnalysis: 70000,
    conservationPlanningAndAdmin: 50000,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 103100,
    blueCarbonProjectPlanning: 125000,
    establishingCarbonRights: 0,
    validation: 50000,
    monitoring: 20000,
    maintenance: 0.0833,
    communityBenefitSharingFund: 0.2,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 100000,
    longTermProjectOperatingCost: 87500,
    financingCost: 0,
  },
  parameters: {
    lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
    emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_3,
    projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
    projectSpecificLossRate: -0.18,
    projectSpecificEmissionFactor: 15,
    emissionFactorAGB: 460,
    emissionFactorSOC: 72,
  },
};

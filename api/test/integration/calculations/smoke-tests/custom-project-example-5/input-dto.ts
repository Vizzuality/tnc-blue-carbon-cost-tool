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
  countryCode: 'KEN',
  projectName: 'Custom project (Example 5)',
  ecosystem: ECOSYSTEM.SEAGRASS,
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 10000,
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
    feasibilityAnalysis: 50000,
    conservationPlanningAndAdmin: 50000,
    dataCollectionAndFieldCost: 26666.6666666667,
    communityRepresentation: 30000,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 15000,
    validation: 50000,
    monitoring: 20000,
    maintenance: 0.0833,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 15000,
    longTermProjectOperatingCost: 15000,
    financingCost: 0,
  },
  parameters: {
    lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
    emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
    projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
    projectSpecificEmissionFactor: 15,
    emissionFactorAGB: 200,
    emissionFactorSOC: 15,
  },
};

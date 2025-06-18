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
  countryCode: 'COL',
  projectName: 'Custom project (Example 3)',
  ecosystem: ECOSYSTEM.MANGROVE,
  activity: ACTIVITY.CONSERVATION,
  projectSizeHa: 5000,
  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
  initialCarbonPriceAssumption: 30,
  assumptions: {
    baselineReassessmentFrequency: 10,
    buffer: 0.25,
    carbonPriceIncrease: 0.015,
    projectLength: 30,
    discountRate: 0.04,
    verificationFrequency: 5,
  },
  costInputs: {
    implementationLabor: 0,
    feasibilityAnalysis: 50000,
    conservationPlanningAndAdmin: 80000,
    dataCollectionAndFieldCost: 50000,
    communityRepresentation: 0,
    blueCarbonProjectPlanning: 100000,
    establishingCarbonRights: 15000,
    validation: 50000,
    monitoring: 6500,
    maintenance: 0.03,
    communityBenefitSharingFund: 0.5,
    carbonStandardFees: 0.2,
    baselineReassessment: 40000,
    mrv: 0,
    longTermProjectOperatingCost: 15000,
    financingCost: 0,
  },
  parameters: {
    lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
    emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_2,
    projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
    projectSpecificEmissionFactor: 15,
    emissionFactorAGB: 200,
    emissionFactorSOC: 15,
  },
};

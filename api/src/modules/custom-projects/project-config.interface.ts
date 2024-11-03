import { BaseDataView } from '@shared/entities/base-data.view';

// TODO: This seems to be a mix of assumptions, base sizes and increases. Check with Data
export const DEFAULT_STUFF = {
  VERIFICATION_FREQUENCY: 5,
  BASELINE_REASSESSMENT_FREQUENCY: 10,
  DISCOUNT_RATE: 0.04,
  CARBON_PRICE_INCREASE: 0.015,
  ANNUAL_COST_INCREASE: 0,
  BUFFER: 0.2,
  SOIL_ORGANIC_CARBON_RELEASE_LENGTH: 10,
  RESTORATION_STARTING_POINT_SCALING: 500,
  CONSERVATION_STARTING_POINT_SCALING: 20000,
  RESTORATION_PROJECT_LENGTH: 20,
  CONSERVATION_PROJECT_LENGTH: 20,
  RESTORATION_RATE: 250,
  DEFAULT_PROJECT_LENGTH: 40,
};

export interface ConservationProjectConfig {
  ecosystem: string;
  countryCode: string;
  data: BaseDataView;
  projectSizeHa: number;
  carbonPrice?: number;
  carbonRevenuesToCover?: string;
  lossRateUsed: string;
  projectSpecificLossRate?: number;
  emissionFactorUsed: string;
  tier3ProjectSpecificEmission?: string;
  tier3ProjectSpecificEmissionOneFactor?: number;
  tier3EmissionFactorAGB?: number;
  tier3EmissionFactorSOC?: number;
}

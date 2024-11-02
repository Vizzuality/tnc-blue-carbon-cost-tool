import { BaseDataView } from '@shared/entities/base-data.view';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';

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

export class ProjectCalculationBuilder {
  private countryCode: string;
  private ecosystem: string;
  private activity: string;
  private carbonPrice: number;
  private revenuesToCover: number;
  // baseData here references the cost inputs, which can be the defaults found, or be overridden by the user
  private baseData: BaseDataView;
  private assumptions: ModelAssumptions;
  // This seems to be a hardcoded value in the notebook, double check how it should work: Is editable etc
  private soilOrganicCarbonReleaseLength: number = 10;
  constructor(config: {
    countryCode: string;
    ecosystem: string;
    activity: string;
    carbonPrice: number;
    revenuesToCover: number;
    baseData: BaseDataView;
    assumptions: ModelAssumptions;
    baseSize: BaseSize;
    baseIncrease: BaseIncrease;
  }) {
    this.countryCode = config.countryCode;
    this.ecosystem = config.ecosystem;
    this.activity = config.activity;
    // We need base size and increase here
    this.carbonPrice = config.carbonPrice;
    this.revenuesToCover = config.revenuesToCover;
    this.baseData = config.baseData;
    this.assumptions = config.assumptions;
  }
}

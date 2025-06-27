import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { GeneralProjectInputs } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import {
  ModelAssumptionsForCalculations,
  NonOverridableModelAssumptions,
} from '@api/modules/calculations/assumptions.repository';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import {
  ConservationCustomProjectDto,
  OverridableAssumptionsDto,
  OverridableCostInputsDto,
} from '@shared/dtos/custom-projects/create-custom-project.dto';

export class ConservationProjectInput {
  countryCode: string;

  projectName: string;

  activity: ACTIVITY;

  ecosystem: ECOSYSTEM;

  projectSizeHa: number;

  initialCarbonPriceAssumption: number;

  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  // TODO: Below are not ALL properties of BaseDataView, type properly once the whole flow is clear
  // costAndCarbonInputs:
  //   | Partial<BaseDataView>
  //   | (OverridableCostInputs & AdditionalBaseData);

  costAndCarbonInputs: OverridableCostInputsDto & AdditionalBaseData;

  lossRate: number;

  emissionFactor: number;

  emissionFactorAgb: number;

  emissionFactorSoc: number;

  assumptions: ModelAssumptionsForCalculations;

  setLossRate(
    parameters: ConservationCustomProjectDto,
    carbonInputs: AdditionalBaseData,
  ): this {
    if (parameters.lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE) {
      this.lossRate = carbonInputs.ecosystemLossRate;
    }
    if (parameters.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
      this.lossRate = parameters.projectSpecificLossRate;
    }
    return this;
  }

  setEmissionFactor(
    parameters: ConservationCustomProjectDto,
    additionalBaseData: AdditionalBaseData,
  ): this {
    if (parameters.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_1) {
      this.emissionFactor = additionalBaseData.tier1EmissionFactor;
      this.emissionFactorAgb = null;
      this.emissionFactorSoc = null;
    } else if (
      parameters.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_2
    ) {
      this.emissionFactorAgb = additionalBaseData.emissionFactorAgb;
      this.emissionFactorSoc = additionalBaseData.emissionFactorSoc;
      this.emissionFactor = null;
    } else if (
      parameters.emissionFactorUsed === EMISSION_FACTORS_TIER_TYPES.TIER_3
    ) {
      if (
        parameters.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR
      ) {
        this.emissionFactor = parameters.projectSpecificEmissionFactor;
        this.emissionFactorAgb = null;
        this.emissionFactorSoc = null;
      } else if (
        parameters.projectSpecificEmission ===
        PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS
      ) {
        this.emissionFactor = null;
        this.emissionFactorAgb = parameters.emissionFactorAGB;
        this.emissionFactorSoc = parameters.emissionFactorSOC;
      }
    }
    return this;
  }

  setModelAssumptions(
    overridableAssumptions: OverridableAssumptionsDto,
    rest: NonOverridableModelAssumptions,
  ): this {
    this.assumptions = { ...overridableAssumptions, ...rest };
    return this;
  }

  setCostAndCarbonInputs(
    overridableCostInputs: OverridableCostInputsDto,
    additionalBaseData: AdditionalBaseData,
  ): this {
    this.costAndCarbonInputs = {
      ...additionalBaseData,
      ...overridableCostInputs,
    };
    return this;
  }

  setGeneralInputs(generalInputs: GeneralProjectInputs): this {
    this.projectName = generalInputs.projectName;
    this.countryCode = generalInputs.countryCode;
    this.activity = generalInputs.activity;
    this.ecosystem = generalInputs.ecosystem;
    this.projectSizeHa = generalInputs.projectSizeHa;
    this.initialCarbonPriceAssumption =
      generalInputs.initialCarbonPriceAssumption;
    this.carbonRevenuesToCover = generalInputs.carbonRevenuesToCover;
    return this;
  }
}

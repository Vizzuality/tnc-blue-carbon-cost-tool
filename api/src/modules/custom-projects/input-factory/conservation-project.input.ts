import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { CARBON_REVENUES_TO_COVER } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { OverridableCostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { OverridableAssumptions } from '@api/modules/custom-projects/dto/project-assumptions.dto';
import {
  ConservationProjectParamDto,
  PROJECT_EMISSION_FACTORS,
} from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { GeneralProjectInputs } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';
import {
  ModelAssumptionsForCalculations,
  NonOverridableModelAssumptions,
} from '@api/modules/calculations/assumptions.repository';

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

  costAndCarbonInputs: OverridableCostInputs & AdditionalBaseData;

  lossRate: number;

  emissionFactor: number;

  emissionFactorAgb: number;

  emissionFactorSoc: number;

  assumptions: ModelAssumptionsForCalculations;

  setLossRate(
    parameters: ConservationProjectParamDto,
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
    parameters: ConservationProjectParamDto,
    additionalBaseData: AdditionalBaseData,
  ): this {
    if (parameters.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_1) {
      this.emissionFactor = additionalBaseData.tier1EmissionFactor;
      this.emissionFactorAgb = null;
      this.emissionFactorSoc = null;
    }
    if (parameters.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_2) {
      this.emissionFactorAgb = additionalBaseData.emissionFactorAgb;
      this.emissionFactorSoc = additionalBaseData.emissionFactorSoc;
      this.emissionFactor = null;
    }
    return this;
  }

  setModelAssumptions(
    overridableAssumptions: OverridableAssumptions,
    rest: NonOverridableModelAssumptions,
  ): this {
    this.assumptions = { ...overridableAssumptions, ...rest };
    return this;
  }

  setCostAndCarbonInputs(
    overridableCostInputs: OverridableCostInputs,
    additionalBaseData: AdditionalBaseData,
  ): this {
    this.costAndCarbonInputs = {
      ...overridableCostInputs,
      ...additionalBaseData,
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

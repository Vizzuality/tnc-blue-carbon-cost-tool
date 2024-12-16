import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { CARBON_REVENUES_TO_COVER } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { OverridableCostInputs } from '@shared/dtos/custom-projects/cost.inputs';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import {
  ModelAssumptionsForCalculations,
  NonOverridableModelAssumptions,
} from '@api/modules/calculations/assumptions.repository';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { RestorationProjectParamsDto } from '@api/modules/custom-projects/dto/restoration-project-params.dto';
import { GeneralProjectInputs } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { OverridableAssumptions } from '../dto/project-assumptions.dto';

export class RestorationProjectInput {
  countryCode: string;

  projectName: string;

  activity: ACTIVITY;

  ecosystem: ECOSYSTEM;

  projectSizeHa: number;

  initialCarbonPriceAssumption: number;

  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  activityType: RESTORATION_ACTIVITY_SUBTYPE;

  sequestrationRate: number;

  costAndCarbonInputs: OverridableCostInputs & AdditionalBaseData;

  lossRate: number;

  emissionFactor: number;

  emissionFactorAgb: number;

  emissionFactorSoc: number;

  assumptions: ModelAssumptionsForCalculations;

  setSequestrationRate(
    parameters: RestorationProjectParamsDto,
    additionalBaseData: AdditionalBaseData,
  ): this {
    if (
      parameters.sequestrationRateUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_3
    ) {
      this.sequestrationRate = parameters.projectSpecificSequestrationRate;
    }

    if (
      parameters.sequestrationRateUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_1
    ) {
      this.sequestrationRate = additionalBaseData.tier1SequestrationRate;
    }
    if (
      parameters.sequestrationRateUsed === SEQUESTRATION_RATE_TIER_TYPES.TIER_2
    ) {
      this.sequestrationRate = additionalBaseData.tier2SequestrationRate;
    }
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

  setModelAssumptions(
    overridableAssumptions: OverridableAssumptions,
    rest: NonOverridableModelAssumptions,
  ): this {
    this.assumptions = { ...overridableAssumptions, ...rest };
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

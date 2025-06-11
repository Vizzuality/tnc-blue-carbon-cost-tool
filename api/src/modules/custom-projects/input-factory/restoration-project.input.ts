import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import {
  ModelAssumptionsForCalculations,
  NonOverridableModelAssumptions,
} from '@api/modules/calculations/assumptions.repository';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { GeneralProjectInputs } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { CARBON_REVENUES_TO_COVER } from '@shared/entities/custom-project.entity';
import {
  OverridableAssumptionsDto,
  OverridableCostInputsDto,
  RestorationProjectParamsDto,
} from '@api/modules/custom-projects/dto/create-custom-project.dto';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';
import { RestorationPlanDto } from '@shared/dtos/custom-projects/restoration-plan.dto';

export class RestorationProjectInput {
  countryCode: string;

  projectName: string;

  activity: ACTIVITY;

  ecosystem: ECOSYSTEM;

  projectSizeHa: number;

  initialCarbonPriceAssumption: number;

  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  restorationActivity: RESTORATION_ACTIVITY_SUBTYPE;

  sequestrationRate: number;

  costAndCarbonInputs: OverridableCostInputsDto & AdditionalBaseData;

  lossRate: number;

  emissionFactor: number;

  emissionFactorAgb: number;

  emissionFactorSoc: number;

  assumptions: ModelAssumptionsForCalculations;

  restorationPlan: CostPlanMap;

  setSequestrationRate(
    parameters: RestorationProjectParamsDto,
    additionalBaseData: AdditionalBaseData,
  ): this {
    if (parameters.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_3) {
      this.sequestrationRate = parameters.projectSpecificSequestrationRate;
    }

    if (parameters.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_1) {
      this.sequestrationRate = additionalBaseData.tier1SequestrationRate;
    }
    if (parameters.tierSelector === SEQUESTRATION_RATE_TIER_TYPES.TIER_2) {
      this.sequestrationRate = additionalBaseData.tier2SequestrationRate;
    }
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

  setModelAssumptions(
    overridableAssumptions: OverridableAssumptionsDto,
    rest: NonOverridableModelAssumptions,
  ): this {
    this.assumptions = { ...overridableAssumptions, ...rest };
    return this;
  }

  //TODO: Not optimal type extending, but doing this properly will require deprecation of existing BE classes and use inherited stuff from the zod schema
  //      which after looking at it, won't be straightforward
  setGeneralInputs(
    generalInputs: GeneralProjectInputs & {
      restorationActivity: RESTORATION_ACTIVITY_SUBTYPE;
    },
  ): this {
    this.projectName = generalInputs.projectName;
    this.countryCode = generalInputs.countryCode;
    this.activity = generalInputs.activity;
    this.ecosystem = generalInputs.ecosystem;
    this.projectSizeHa = generalInputs.projectSizeHa;
    this.initialCarbonPriceAssumption =
      generalInputs.initialCarbonPriceAssumption;
    this.carbonRevenuesToCover = generalInputs.carbonRevenuesToCover;
    this.restorationActivity = generalInputs.restorationActivity;
    return this;
  }

  /**
   * @description: Builds the CostPlanMap from the restoration plan DTO array, to be used in the calculation engine
   * @param restorationPlan
   */

  setRestorationPlanMap(restorationPlan: RestorationPlanDto[]): this {
    const restorationPlanMap: CostPlanMap = {};
    for (const { year, annualHectaresRestored } of restorationPlan) {
      restorationPlanMap[year] = annualHectaresRestored;
    }
    this.restorationPlan = restorationPlanMap;
    return this;
  }
}

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
import { BadRequestException } from '@nestjs/common';
import { CostPlanMap } from '@shared/dtos/custom-projects/custom-project-output.dto';

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

  customRestorationPlan?: CostPlanMap;

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
      ...overridableCostInputs,
      ...additionalBaseData,
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

  setCustomRestorationPlan(
    parameters: RestorationProjectParamsDto,
    projectSizeHa: number,
    restorationProjectLength: number,
  ): this {
    const { customRestorationPlan } = parameters;
    if (!customRestorationPlan?.length) {
      // TODO: We are missing how the restoration plan plays a role in the model, so I am not sure if it's not provided, we should return
      //.      a default year + 0 value until reach the restoration project length
      return;
    }
    const restorationPlanHarea = customRestorationPlan.reduce((acc, plan) => {
      return acc + plan.annualHectaresRestored;
    }, 0);
    if (restorationPlanHarea > projectSizeHa) {
      throw new BadRequestException('Restoration plan exceeds project size');
    }
    this.customRestorationPlan = this.buildRestorationPlan(
      customRestorationPlan,
      restorationProjectLength,
    );
    return this;
  }

  private buildRestorationPlan(
    restorationPlan: RestorationProjectParamsDto['customRestorationPlan'],
    projectLength: number,
  ): CostPlanMap {
    const result: CostPlanMap = {};

    const planMap = new Map<number, number>();
    for (const { year, annualHectaresRestored } of restorationPlan ?? []) {
      planMap.set(year, annualHectaresRestored);
    }

    // The plan that can be modified by the user starts at year 1 and does not have to be continuous
    // TODO!!!: According to science example, the missing years are filled with 0! Double check this
    for (let year = 1; year <= projectLength; year++) {
      result[year] = planMap.get(year) ?? 0;
    }

    return result;
  }
}

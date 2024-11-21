import { ACTIVITY } from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { CARBON_REVENUES_TO_COVER } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { OverridableAssumptions } from '@api/modules/custom-projects/dto/project-assumptions.dto';
import {
  ConservationProjectParamDto,
  PROJECT_EMISSION_FACTORS,
} from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { CarbonInputs } from '@api/modules/calculations/data.repository';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import {
  ConservationProjectCarbonInputs,
  GeneralProjectInputs,
} from '@api/modules/custom-projects/input-factory/custom-project-input.factory';

export class ConservationProjectInput {
  countryCode: string;

  projectName: string;

  activity: ACTIVITY;

  ecosystem: ECOSYSTEM;

  projectSizeHa: number;

  initialCarbonPriceAssumption: number;

  carbonRevenuesToCover: CARBON_REVENUES_TO_COVER;

  carbonInputs: ConservationProjectCarbonInputs = {
    lossRate: 0,
    emissionFactor: 0,
    emissionFactorAgb: 0,
    emissionFactorSoc: 0,
  };

  costInputs: CostInputs = new CostInputs();

  modelAssumptions: OverridableAssumptions = new OverridableAssumptions();

  setLossRate(
    parameters: ConservationProjectParamDto,
    carbonInputs: CarbonInputs,
  ): this {
    if (parameters.lossRateUsed === LOSS_RATE_USED.NATIONAL_AVERAGE) {
      this.carbonInputs.lossRate = carbonInputs.ecosystemLossRate;
    }
    if (parameters.lossRateUsed === LOSS_RATE_USED.PROJECT_SPECIFIC) {
      this.carbonInputs.lossRate = parameters.projectSpecificLossRate;
    }
    return this;
  }

  setEmissionFactor(
    parameters: ConservationProjectParamDto,
    carbonInputs: CarbonInputs,
  ): this {
    if (parameters.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_1) {
      this.carbonInputs.emissionFactor = carbonInputs.tier1EmissionFactor;
      this.carbonInputs.emissionFactorAgb = null;
      this.carbonInputs.emissionFactorSoc = null;
    }
    if (parameters.emissionFactorUsed === PROJECT_EMISSION_FACTORS.TIER_2) {
      this.carbonInputs.emissionFactorAgb = carbonInputs.emissionFactorAgb;
      this.carbonInputs.emissionFactorSoc = carbonInputs.emissionFactorSoc;
      this.carbonInputs.emissionFactor = null;
    }
    return this;
  }

  setModelAssumptions(modelAssumptions: OverridableAssumptions): this {
    this.modelAssumptions = modelAssumptions;
    return this;
  }

  setCostInputs(costInputs: CostInputs): this {
    this.costInputs = costInputs;
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

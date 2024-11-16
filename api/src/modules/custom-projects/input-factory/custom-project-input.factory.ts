import { Injectable, NotImplementedException } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import {
  ConservationProjectParamDto,
  PROJECT_EMISSION_FACTORS,
} from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { CarbonInputs } from '@api/modules/calculations/data.repository';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import {
  CARBON_REVENUES_TO_COVER,
  CreateCustomProjectDto,
} from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { CustomProjectAssumptionsDto } from '@api/modules/custom-projects/dto/project-assumptions.dto';

export type ConservationProjectCarbonInputs = {
  lossRate: number;
  emissionFactor: number | null;
  emissionFactorAgb: number | null;
  emissionFactorSoc: number | null;
};

export type GeneralProjectInputs = {
  projectName: CreateCustomProjectDto['projectName'];
  countryCode: CreateCustomProjectDto['countryCode'];
  activity: CreateCustomProjectDto['activity'];
  ecosystem: CreateCustomProjectDto['ecosystem'];
  projectSizeHa: CreateCustomProjectDto['projectSizeHa'];
  initialCarbonPriceAssumption: CreateCustomProjectDto['initialCarbonPriceAssumption'];
  carbonRevenuesToCover: CreateCustomProjectDto['carbonRevenuesToCover'];
};

@Injectable()
export class CustomProjectInputFactory {
  createProjectInput(dto: CreateCustomProjectDto, carbonInputs: CarbonInputs) {
    if (dto.activity === ACTIVITY.CONSERVATION) {
      return this.createConservationProjectInput(dto, carbonInputs);
    } else if (dto.activity === ACTIVITY.RESTORATION) {
      throw new NotImplementedException('Restoration not implemented');
    } else {
      throw new Error('Invalid activity type');
    }
  }

  private createConservationProjectInput(
    dto: CreateCustomProjectDto,
    carbonInputs: CarbonInputs,
  ): ConservationProjectInput {
    const {
      parameters,
      assumptions,
      costInputs,
      projectName,
      projectSizeHa,
      initialCarbonPriceAssumption,
      activity,
      carbonRevenuesToCover,
      ecosystem,
      countryCode,
    } = dto;

    const projectParams = parameters as ConservationProjectParamDto;

    const conservationProjectInput: ConservationProjectInput =
      new ConservationProjectInput();
    conservationProjectInput.setGeneralInputs({
      projectName,
      projectSizeHa,
      initialCarbonPriceAssumption,
      activity,
      carbonRevenuesToCover,
      ecosystem,
      countryCode,
    });
    conservationProjectInput.setLossRate(projectParams, carbonInputs);
    conservationProjectInput.setEmissionFactor(projectParams, carbonInputs);
    conservationProjectInput.setCostInputs(costInputs);
    conservationProjectInput.setModelAssumptions(assumptions);

    return conservationProjectInput;
  }
}

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

  modelAssumptions: CustomProjectAssumptionsDto =
    new CustomProjectAssumptionsDto();

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

  setModelAssumptions(modelAssumptions: CustomProjectAssumptionsDto): this {
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

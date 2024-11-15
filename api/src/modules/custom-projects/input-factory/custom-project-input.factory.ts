import { Injectable } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { ProjectConfig } from '@api/modules/custom-projects/project-config.interface';
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
import { CostInputs } from '@api/modules/custom-projects/cost-inputs.interface';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';

export type ConservationProjectCarbonInputs = {
  lossRate: number;
  emissionFactor: number | null;
  emissionFactorAgb: number | null;
  emissionFactorSoc: number | null;
};

@Injectable()
export class CustomProjectInputFactory {
  createProject(dto: CreateCustomProjectDto, carbonInputs: CarbonInputs) {
    if (dto.activity === ACTIVITY.CONSERVATION) {
      //return new ConservationProject(projectConfig);
      return this.createConservationProjectInput(dto, carbonInputs);
    } else if (dto.activity === ACTIVITY.RESTORATION) {
      // Instanciaremos RestorationProject una vez esté implementado
      //return new RestorationProject(projectConfig, baseData);
    } else {
      throw new Error('Invalid activity type');
    }
  }

  createProjectInput(dto: CreateCustomProjectDto, carbonInputs: CarbonInputs) {
    if (dto.activity === ACTIVITY.CONSERVATION) {
      return this.createConservationProjectInput(
        dto.parameters as ConservationProjectParamDto,
        carbonInputs,
      );
    } else if (dto.activity === ACTIVITY.RESTORATION) {
      // Instanciaremos RestorationProject una vez esté implementado
      //return new RestorationProject(projectConfig, baseData);
    } else {
      throw new Error('Invalid activity type');
    }
  }

  private createConservationProjectInput(
    parameters: ConservationProjectParamDto,
    carbonInputs: CarbonInputs,
  ): ConservationProjectCarbonInputs {
    const conservationProjectInput: ConservationProjectInput =
      new ConservationProjectInput();

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

  carbonInputs: ConservationProjectCarbonInputs;

  costInputs: CostInputs;

  modelAssumptions: ModelAssumptions;

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

  setModelAssumptions(modelAssumptions: ModelAssumptions): this {
    this.modelAssumptions = modelAssumptions;
    return this;
  }

  setCostInputs(costInputs: CostInputs): this {
    this.costInputs = costInputs;
  }

  setProject;
}

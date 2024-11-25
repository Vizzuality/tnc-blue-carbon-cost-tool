import { Injectable, NotImplementedException } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';

import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import {
  ModelAssumptionsForCalculations,
  NonOverridableModelAssumptions,
} from '@api/modules/calculations/assumptions.repository';
import { BaseDataView } from '@shared/entities/base-data.view';

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
  createProjectInput(
    dto: CreateCustomProjectDto,
    additionalBaseData: AdditionalBaseData,
    additionalAssumptions: NonOverridableModelAssumptions,
  ) {
    if (dto.activity === ACTIVITY.CONSERVATION) {
      return this.createConservationProjectInput(
        dto,
        additionalBaseData,
        additionalAssumptions,
      );
    } else if (dto.activity === ACTIVITY.RESTORATION) {
      throw new NotImplementedException('Restoration not implemented');
    } else {
      throw new Error('Invalid activity type');
    }
  }

  private createConservationProjectInput(
    dto: CreateCustomProjectDto,
    additionalBaseData: AdditionalBaseData,
    additionalAssumptions: NonOverridableModelAssumptions,
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
    conservationProjectInput.setLossRate(projectParams, additionalBaseData);
    conservationProjectInput.setEmissionFactor(
      projectParams,
      additionalBaseData,
    );
    conservationProjectInput.setCostAndCarbonInputs(
      costInputs,
      additionalBaseData,
    );
    conservationProjectInput.setModelAssumptions(
      assumptions,
      additionalAssumptions,
    );

    return conservationProjectInput;
  }
}

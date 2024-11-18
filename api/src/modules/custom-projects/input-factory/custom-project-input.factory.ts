import { Injectable, NotImplementedException } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { CarbonInputs } from '@api/modules/calculations/data.repository';

import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';

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

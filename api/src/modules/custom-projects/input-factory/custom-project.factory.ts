import { Injectable, NotImplementedException } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProjectParamDto } from '@api/modules/custom-projects/dto/conservation-project-params.dto';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';

import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { NonOverridableModelAssumptions } from '@api/modules/calculations/assumptions.repository';
import { CostOutput } from '@api/modules/calculations/calculation.engine';
import { ProjectInput } from '@api/modules/calculations/cost.calculator';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { Country } from '@shared/entities/country.entity';

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
export class CustomProjectFactory {
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

  createProject(
    dto: CreateCustomProjectDto,
    input: ProjectInput,
    output: CostOutput,
  ): CustomProject {
    const { costPlans, summary, costDetails, yearlyBreakdown } = output;
    const customProject = new CustomProject();
    customProject.projectName = dto.projectName;
    customProject.country = { code: dto.countryCode } as Country;
    customProject.totalCostNPV =
      costPlans.totalCapexNPV + costPlans.totalOpexNPV;
    customProject.totalCost = costPlans.totalCapex + costPlans.totalOpex;
    customProject.projectSize = dto.projectSizeHa;
    customProject.projectLength = dto.assumptions.projectLength;
    customProject.ecosystem = dto.ecosystem;
    customProject.activity = dto.activity;
    customProject.output = {
      lossRate: input.lossRate,
      carbonRevenuesToCover: input.carbonRevenuesToCover,
      initialCarbonPrice: input.initialCarbonPriceAssumption,
      emissionFactors: {
        emissionFactor: input.emissionFactor,
        emissionFactorAgb: input.emissionFactorAgb,
        emissionFactorSoc: input.emissionFactorSoc,
      },
      totalProjectCost: {
        total: {
          total: costPlans.totalCapex + costPlans.totalOpex,
          capex: costPlans.totalCapex,
          opex: costPlans.totalOpex,
        },
        npv: {
          total: costPlans.totalCapexNPV + costPlans.totalOpexNPV,
          capex: costPlans.totalCapexNPV,
          opex: costPlans.totalOpexNPV,
        },
      },
      summary,
      costDetails,
      yearlyBreakdown,
    };
    customProject.input = dto;

    return customProject;
  }
}

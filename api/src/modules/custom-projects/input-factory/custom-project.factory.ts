import { Injectable } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { AdditionalBaseData } from '@api/modules/calculations/data.repository';
import { ConservationProjectInput } from '@api/modules/custom-projects/input-factory/conservation-project.input';
import { NonOverridableModelAssumptions } from '@api/modules/calculations/assumptions.repository';
import {
  CARBON_REVENUES_TO_COVER,
  CustomProject,
} from '@shared/entities/custom-project.entity';
import { Country } from '@shared/entities/country.entity';
import { RestorationProjectInput } from '@api/modules/custom-projects/input-factory/restoration-project.input';
import {
  ConservationCustomProjectDto,
  CreateCustomProjectDto,
  RestorationProjectParamsDto,
} from '@api/modules/custom-projects/dto/create-custom-project.dto';
import { CostOutput, ProjectInput } from '@api/modules/calculations/types';
import { RestorationPlanService } from '@api/modules/custom-projects/restoration-plan.service';
import { RestorationPlanDto } from '@shared/dtos/custom-projects/restoration-plan.dto';
import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity';

export type GeneralProjectInputs = {
  ecosystemExtent?: number;
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
  constructor(
    private readonly restorationPlanService: RestorationPlanService,
  ) {}
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
      return this.createRestorationProjectInput(
        dto,
        additionalBaseData,
        additionalAssumptions,
      );
    } else {
      throw new Error('Invalid activity type');
    }
  }

  private createRestorationProjectInput(
    dto: CreateCustomProjectDto,
    additionalBaseData: AdditionalBaseData,
    additionalAssumptions: NonOverridableModelAssumptions,
  ) {
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

    const projectParams = parameters as RestorationProjectParamsDto;
    const customRestorationPlan =
      projectParams.customRestorationPlan as RestorationPlanDto[];

    const restorationPlan = this.restorationPlanService.createRestorationPlan({
      projectSizeHa,
      customRestorationPlan,
      restorationRate: assumptions.restorationRate,
      restorationProjectLength: assumptions.projectLength,
    });

    const restorationProjectInput: RestorationProjectInput =
      new RestorationProjectInput();
    restorationProjectInput.setGeneralInputs({
      projectName,
      projectSizeHa,
      initialCarbonPriceAssumption,
      activity,
      carbonRevenuesToCover,
      ecosystem,
      countryCode,
      restorationActivity: projectParams.restorationActivity,
    });
    restorationProjectInput.setSequestrationRate(
      projectParams,
      additionalBaseData,
    );
    restorationProjectInput.setCostAndCarbonInputs(
      costInputs,
      additionalBaseData,
    );

    // TODO: This is a workaround as it seems that planting success rate is defined as parameter, and it was previously a non overridable assumption
    //       However, now we need to use this as overridable assumption. To make this right:
    //       1. we need to remove it from the non overridable assumptions definition
    //       2. the FE should send it as assumption instead of parameter
    if (projectParams.plantingSuccessRate) {
      additionalAssumptions.plantingSuccessRate =
        projectParams.plantingSuccessRate;
    }
    restorationProjectInput.setModelAssumptions(
      assumptions,
      additionalAssumptions,
    );
    restorationProjectInput.setRestorationPlanMap(restorationPlan);
    return restorationProjectInput;
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

    const projectParams = parameters as ConservationCustomProjectDto;

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
      ecosystemExtent: additionalBaseData.ecosystemExtent,
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
    country: Country,
    input: ProjectInput,
    breakevenCarbonPrice: number | null,
    costOutput: CostOutput,
    breakevenPriceCostOutput: CostOutput | null,
    version?: ModelComponentsVersionEntity,
  ): CustomProject {
    const customProject = new CustomProject();
    customProject.projectName = dto.projectName;
    customProject.abatementPotential = costOutput.costPlans.abatementPotential;
    customProject.country = {
      code: country.code,
      name: country.name,
    } as Country;
    customProject.totalCostNPV =
      costOutput.costPlans.totalCapexNPV + costOutput.costPlans.totalOpexNPV;
    customProject.totalCost =
      costOutput.costPlans.totalCapex + costOutput.costPlans.totalOpex;

    if (breakevenPriceCostOutput) {
      customProject.breakevenTotalCost =
        breakevenPriceCostOutput.costPlans.totalCapex +
        breakevenPriceCostOutput.costPlans.totalOpex;
      customProject.breakevenTotalCostNPV =
        breakevenPriceCostOutput.costPlans.totalCapexNPV +
        breakevenPriceCostOutput.costPlans.totalOpexNPV;
    }

    customProject.projectSize = dto.projectSizeHa;
    customProject.projectLength = dto.assumptions.projectLength;
    customProject.ecosystem = dto.ecosystem;
    customProject.activity = dto.activity;
    customProject.output = {
      initialCarbonPriceComputationOutput: this.generateProjectOutputObject(
        input,
        input.assumptions.carbonPrice,
        costOutput,
      ),
      breakevenPriceComputationOutput: this.generateProjectOutputObject(
        input,
        breakevenCarbonPrice,
        breakevenPriceCostOutput,
      ),
    };
    customProject.input = dto;
    customProject.version = version;

    return customProject;
  }

  private generateProjectOutputObject(
    input: ProjectInput,
    carbonPrice: number | null,
    costOutput: CostOutput | null,
  ) {
    if (!costOutput || !carbonPrice) {
      return null;
    }

    // TODO: Unmantainable code, refactor once all calculations are fixed

    const leftOverValueToSet: number =
      input.carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
        ? costOutput.costPlans.totalRevenue - costOutput.costPlans.totalOpex
        : costOutput.costPlans.totalRevenue -
          (costOutput.costPlans.totalCapex + costOutput.costPlans.totalOpex);

    const npvLeftOverValueToSet: number =
      input.carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
        ? costOutput.costPlans.totalRevenueNPV -
          costOutput.costPlans.totalOpexNPV
        : costOutput.costPlans.totalRevenueNPV - costOutput.costPlans.totalNPV;

    const leftOverCapexOrCapexAndOpexValueToSet: number =
      input.carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
        ? costOutput.costPlans.totalOpex
        : costOutput.costPlans.totalCapex + costOutput.costPlans.totalOpex;

    const npvLeftOverCapexOrCapexAndOpexValueToSet: number =
      input.carbonRevenuesToCover === CARBON_REVENUES_TO_COVER.OPEX
        ? costOutput.costPlans.totalOpexNPV
        : costOutput.costPlans.totalCapexNPV +
          costOutput.costPlans.totalOpexNPV;

    return {
      lossRate:
        input.activity === ACTIVITY.CONSERVATION ? input.lossRate : undefined,
      carbonRevenuesToCover: input.carbonRevenuesToCover,
      sequestrationRate:
        input instanceof RestorationProjectInput
          ? input.sequestrationRate
          : undefined,
      plantingSuccessRate:
        input instanceof RestorationProjectInput
          ? input.assumptions.plantingSuccessRate
          : undefined,
      initialCarbonPrice: carbonPrice,
      emissionFactors:
        input.activity === ACTIVITY.CONSERVATION
          ? {
              emissionFactor: input.emissionFactor,
              emissionFactorAgb: input.emissionFactorAgb,
              emissionFactorSoc: input.emissionFactorSoc,
            }
          : undefined,
      totalProjectCost: {
        total: {
          total:
            costOutput.costPlans.totalCapex + costOutput.costPlans.totalOpex,
          capex: costOutput.costPlans.totalCapex,
          opex: costOutput.costPlans.totalOpex,
        },
        npv: {
          total:
            costOutput.costPlans.totalCapexNPV +
            costOutput.costPlans.totalOpexNPV,
          capex: costOutput.costPlans.totalCapexNPV,
          opex: costOutput.costPlans.totalOpexNPV,
        },
      },
      leftover: {
        total: {
          total: costOutput.costPlans.totalRevenue,
          leftover: leftOverValueToSet,
          opex: leftOverCapexOrCapexAndOpexValueToSet,
        },
        npv: {
          total: costOutput.costPlans.totalRevenueNPV,
          leftover: npvLeftOverValueToSet,
          opex: npvLeftOverCapexOrCapexAndOpexValueToSet,
        },
      },
      summary: costOutput.summary,
      costDetails: costOutput.costDetails,
      yearlyBreakdown: costOutput.yearlyBreakdown,
      sensitivityAnalysis: costOutput.sensitivityAnalysis,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { CustomProjectFactory } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { ProjectCalculationFactory } from '@api/modules/projects/calculation/project-calculation.factory';
import { CreateProjectDto } from '@shared/dtos/projects/create-project.dto';
import { CalculationEngineOutput } from '@api/modules/calculations/types';

@Injectable()
export class ProjectsCalculationService {
  constructor(
    private readonly engine: CalculationEngine,
    private readonly dataRepo: DataRepository,
    private readonly customProjectFactory: CustomProjectFactory,
  ) {}

  async computeCostForProject(
    dto: CreateProjectDto,
  ): Promise<CalculationEngineOutput> {
    const { countryCode, ecosystem, activity, restorationActivity } = dto;
    const {
      defaultAssumptions,
      defaultCostInputs,
      additionalBaseData,
      additionalAssumptions,
      baseSize,
      baseIncrease,
    } = await this.dataRepo.getDataToComputeProjects({
      countryCode,
      ecosystem,
      activity,
      restorationActivity,
    });

    if (dto.initialCarbonPriceAssumption) {
      additionalAssumptions.carbonPrice = dto.initialCarbonPriceAssumption;
    }

    const createDto = new ProjectCalculationFactory(
      dto,
      defaultAssumptions,
      defaultCostInputs,
    ).toCreateCustomProjectDto();

    const projectInput = this.customProjectFactory.createProjectInput(
      createDto,
      additionalBaseData,
      additionalAssumptions,
    );

    const output = this.engine.calculate({
      projectInput,
      baseIncrease,
      baseSize,
    });

    return output;
  }
}

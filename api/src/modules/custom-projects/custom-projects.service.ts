import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectInputFactory } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';
import { GetDefaultCostInputsDto } from '@shared/dtos/custom-projects/get-default-cost-inputs.dto';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { CostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { CustomProjectAssumptionsDto } from '@api/modules/custom-projects/dto/project-assumptions.dto';
import { CostCalculator } from '@api/modules/calculations/cost.calculator';
import { CustomProjectSnapshotDto } from './dto/custom-project-snapshot.dto';

@Injectable()
export class CustomProjectsService extends AppBaseService<
  CustomProject,
  CreateCustomProjectDto,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(CustomProject)
    public readonly repo: Repository<CustomProject>,
    public readonly calculationEngine: CalculationEngine,
    public readonly dataRepository: DataRepository,
    public readonly customProjectFactory: CustomProjectInputFactory,
    public readonly dataSource: DataSource,
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const { countryCode, ecosystem, activity } = dto;
    const { defaultCarbonInputs, baseIncrease, baseSize } =
      await this.dataRepository.getDataForCalculation({
        countryCode,
        ecosystem,
        activity,
      });

    const projectInput = this.customProjectFactory.createProjectInput(
      dto,
      defaultCarbonInputs,
    );
    // TODO: Don't know where this values should come from. i.e default project length comes from the assumptions based on activity? In the python calcs, the same
    //       value is used regardless of the activity.
    const DEFAULT_PROJECT_LENGTH = 40;
    const CONSERVATION_STARTING_POINT_SCALING = 500;
    const RESTORATION_STARTING_POINT_SCALING = 20000;

    const calculator = new CostCalculator(
      projectInput,
      DEFAULT_PROJECT_LENGTH,
      CONSERVATION_STARTING_POINT_SCALING,
      baseSize,
      baseIncrease,
    );

    calculator.initializeCostPlans().calculateCosts();
    return calculator.costPlans;
  }

  async saveCustomProject(dto: CustomProjectSnapshotDto): Promise<void> {
    await this.repo.save(CustomProject.fromCustomProjectSnapshotDTO(dto));
  }

  async getDefaultCostInputs(
    dto: GetDefaultCostInputsDto,
  ): Promise<CostInputs> {
    return this.dataRepository.getDefaultCostInputs(dto);
  }

  async getDefaultAssumptions(): Promise<CustomProjectAssumptionsDto> {
    const modelAssumptions =
      await this.dataRepository.getDefaultModelAssumptions();
    const projectAssumptions = new CustomProjectAssumptionsDto();
    modelAssumptions.forEach((assumption) => {
      projectAssumptions[assumption.name] = assumption.value;
    });
    return projectAssumptions;
  }
}

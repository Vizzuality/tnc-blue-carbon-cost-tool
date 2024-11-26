import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectInputFactory } from '@api/modules/custom-projects/input-factory/custom-project-input.factory';
import { GetOverridableCostInputs } from '@shared/dtos/custom-projects/get-overridable-cost-inputs.dto';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { OverridableCostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { CostCalculator } from '@api/modules/calculations/cost.calculator';
import { CustomProjectSnapshotDto } from './dto/custom-project-snapshot.dto';
import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions.dto';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';

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
    public readonly assumptionsRepository: AssumptionsRepository,
    public readonly customProjectFactory: CustomProjectInputFactory,
  ) {
    super(repo, 'customProject', 'customProjects');
  }

  async create(dto: CreateCustomProjectDto): Promise<any> {
    const { countryCode, ecosystem, activity } = dto;
    const {
      additionalBaseData,
      baseIncrease,
      baseSize,
      additionalAssumptions,
    } = await this.dataRepository.getDataForCalculation({
      countryCode,
      ecosystem,
      activity,
    });

    const projectInput = this.customProjectFactory.createProjectInput(
      dto,
      additionalBaseData,
      additionalAssumptions,
    );

    const calculator = new CostCalculator(projectInput, baseSize, baseIncrease);

    const costPlans = calculator.initializeCostPlans().calculateCosts();
    return costPlans;
  }

  async saveCustomProject(dto: CustomProjectSnapshotDto): Promise<void> {
    await this.repo.save(CustomProject.fromCustomProjectSnapshotDTO(dto));
  }

  async getDefaultCostInputs(
    dto: GetOverridableCostInputs,
  ): Promise<OverridableCostInputs> {
    return this.dataRepository.getOverridableCostInputs(dto);
  }

  async getDefaultAssumptions(dto: GetOverridableAssumptionsDTO) {
    return this.assumptionsRepository.getOverridableModelAssumptions(dto);
  }
}

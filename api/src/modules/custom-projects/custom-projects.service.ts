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
    const defaultCarbonInputs =
      await this.dataRepository.getDefaultCarbonInputs({
        countryCode,
        ecosystem,
        activity,
      });

    const projectInput = this.customProjectFactory.createProject(
      dto,
      defaultCarbonInputs,
    );
    return projectInput;
  }

  async getDefaultCostInputs(
    dto: GetDefaultCostInputsDto,
  ): Promise<CostInputs> {
    return this.calculationEngine.getDefaultCostInputs(dto);
  }
}

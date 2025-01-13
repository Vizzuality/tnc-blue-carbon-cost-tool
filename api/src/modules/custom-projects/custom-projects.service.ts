import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { CreateCustomProjectDto } from '@api/modules/custom-projects/dto/create-custom-project-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectFactory } from '@api/modules/custom-projects/input-factory/custom-project.factory';
import { GetOverridableCostInputs } from '@shared/dtos/custom-projects/get-overridable-cost-inputs.dto';
import { DataRepository } from '@api/modules/calculations/data.repository';
import { OverridableCostInputs } from '@api/modules/custom-projects/dto/project-cost-inputs.dto';
import { GetOverridableAssumptionsDTO } from '@shared/dtos/custom-projects/get-overridable-assumptions.dto';
import { AssumptionsRepository } from '@api/modules/calculations/assumptions.repository';
import { User } from '@shared/entities/users/user.entity';
import { EventBus } from '@nestjs/cqrs';
import { SaveCustomProjectEvent } from '@api/modules/custom-projects/events/save-custom-project.event';
import { FetchSpecification } from 'nestjs-base-service';
import { GetActivityTypesDefaults } from '@shared/dtos/custom-projects/get-activity-types-defaults.dto';
import { z } from 'zod';
import { customProjecsQuerySchema } from '@shared/contracts/custom-projects.contract';
import { In } from 'typeorm';

export type CustomProjectFetchSpecificacion = z.infer<
  typeof customProjecsQuerySchema
>;

@Injectable()
export class CustomProjectsService extends AppBaseService<
  CustomProject,
  CreateCustomProjectDto,
  unknown,
  unknown
> {
  logger = new Logger(CustomProjectsService.name);
  constructor(
    @InjectRepository(CustomProject)
    public readonly repo: Repository<CustomProject>,
    public readonly calculationEngine: CalculationEngine,
    public readonly dataRepository: DataRepository,
    public readonly assumptionsRepository: AssumptionsRepository,
    public readonly customProjectFactory: CustomProjectFactory,
    private readonly eventBus: EventBus,
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
      country,
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

    const costOutput = this.calculationEngine.calculateCostOutput({
      projectInput,
      baseIncrease,
      baseSize,
    });

    const customProject = this.customProjectFactory.createProject(
      dto,
      country,
      projectInput,
      costOutput,
    );

    const breakevenPrice = this.calculationEngine.calculateBreakevenPrice({
      projectInput,
      baseIncrease,
      baseSize,
      maxIterations: 100,
      tolerance: 0.00001,
    });

    return customProject;
  }

  async saveCustomProject(dto: CustomProject, user: User): Promise<void> {
    try {
      await this.repo.save({ ...dto, user });
      this.eventBus.publish(new SaveCustomProjectEvent(user.id, true));
    } catch (error) {
      this.logger.error(`Error saving custom project: ${error}`);
      this.eventBus.publish(new SaveCustomProjectEvent(user.id, false, error));
      throw new ServiceUnavailableException(
        `Custom project could not be saved, please try again later`,
      );
    }
  }

  async getActivityTypeDefaults(dto: GetActivityTypesDefaults) {
    return this.dataRepository.getActivityTypesDefaults(dto);
  }

  async getDefaultCostInputs(
    dto: GetOverridableCostInputs,
  ): Promise<OverridableCostInputs> {
    return this.dataRepository.getOverridableCostInputs(dto);
  }

  async getDefaultAssumptions(dto: GetOverridableAssumptionsDTO) {
    return this.assumptionsRepository.getOverridableModelAssumptions(dto);
  }

  async extendGetByIdQuery(
    query: SelectQueryBuilder<CustomProject>,
    fetchSpecification?: FetchSpecification,
    info?: { user: User },
  ): Promise<SelectQueryBuilder<CustomProject>> {
    const { user } = info;

    query
      .leftJoinAndSelect('customProject.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id });

    return query;
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<CustomProject>,
    fetchSpecification: CustomProjectFetchSpecificacion,
    info?: { user: User },
  ): Promise<SelectQueryBuilder<CustomProject>> {
    const { user } = info;

    query
      .leftJoinAndSelect('customProject.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id });

    if (fetchSpecification.partialProjectName) {
      query = query.andWhere('project_name ILIKE :projectName', {
        projectName: `%${fetchSpecification.partialProjectName}%`,
      });
    }

    return query;
  }

  async areProjectsCreatedByUser(
    userId: string,
    projectIds: string[],
  ): Promise<boolean> {
    const customProjects = await this.repo.findBy({ id: In(projectIds) });

    return customProjects.every(
      (customProject) => customProject.user?.id === userId,
    );
  }
}

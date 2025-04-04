import { Injectable, Logger } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { COST_TYPE_SELECTOR, Project } from '@shared/entities/projects.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { PaginatedProjectsWithMaximums } from '@shared/dtos/projects/projects.dto';
import { PROJECT_KEY_COSTS_FIELDS } from '@shared/dtos/projects/project-key-costs.dto';
import { ProjectsFiltersBoundsDto } from '@shared/dtos/projects/projects-filters-bounds.dto';
import {
  CreateProjectDto,
  ProjectsCalculationService,
} from '@api/modules/projects/calculation/projects-calculation.service';
import { ProjectBuilder } from '@api/modules/projects/project.builder';
import { ProjectsScorecardService } from '@api/modules/projects/projects-scorecard.service';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { ExcelProject } from '@api/modules/import/dtos/excel-projects.dto';
import { Country } from '@shared/entities/country.entity';

export type ProjectFetchSpecification = z.infer<typeof getProjectsQuerySchema>;

@Injectable()
export class ProjectsService extends AppBaseService<
  Project,
  unknown,
  unknown,
  unknown
> {
  logger = new Logger(ProjectsService.name);
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    public readonly projectRepository: Repository<Project>,
    private readonly projectCalculation: ProjectsCalculationService,
    private readonly scorecard: ProjectsScorecardService,
  ) {
    super(projectRepository, 'project', 'projects');
  }

  public async findAllProjectsWithMaximums(
    query: ProjectFetchSpecification,
  ): Promise<PaginatedProjectsWithMaximums> {
    const qb = this.dataSource
      .createQueryBuilder()
      .select('MAX(abatement_potential)', 'maxAbatementPotential')
      .from(Project, 'project');

    const { costRangeSelector } = query;
    if (costRangeSelector == COST_TYPE_SELECTOR.NPV) {
      qb.addSelect('MAX(capex_npv + opex_npv)', 'maxTotalCost');
    } else {
      qb.addSelect('MAX(capex + opex)', 'maxTotalCost');
    }

    const totalsQuery = this.applySearchFiltersToQueryBuilder(qb, query);

    const [{ maxAbatementPotential, maxTotalCost }, { metadata, data }] =
      await Promise.all([
        totalsQuery.getRawOne(),
        this.findAllPaginated(query),
      ]);

    // The numbers are too big at the moment.
    return {
      metadata,
      maximums: {
        maxAbatementPotential: Number(maxAbatementPotential),
        maxTotalCost: Number(maxTotalCost),
      },
      data,
    };
  }

  private applySearchFiltersToQueryBuilder(
    query: SelectQueryBuilder<Project>,
    fetchSpecification: ProjectFetchSpecification,
  ): SelectQueryBuilder<Project> {
    // Filter by project name
    if (fetchSpecification.partialProjectName) {
      query.andWhere('project_name ILIKE :projectName', {
        projectName: `%${fetchSpecification.partialProjectName}%`,
      });
    }

    // Filter by abatement potential
    if (fetchSpecification.abatementPotentialRange) {
      query.andWhere(
        'abatement_potential >= :minAP AND abatement_potential <= :maxAP',
        {
          minAP: Math.min(...fetchSpecification.abatementPotentialRange),
          maxAP: Math.max(...fetchSpecification.abatementPotentialRange),
        },
      );
    }

    // Filter by cost (total or NPV)
    if (fetchSpecification.costRange && fetchSpecification.costRangeSelector) {
      let filteredCostColumn: string;
      switch (fetchSpecification.costRangeSelector) {
        case 'npv':
          filteredCostColumn = 'total_cost_npv';
          break;
        case 'total':
        default:
          filteredCostColumn = 'total_cost';
          break;
      }

      query.andWhere(
        `${filteredCostColumn} >= :minCost AND ${filteredCostColumn} <= :maxCost`,
        {
          minCost: Math.min(...fetchSpecification.costRange),
          maxCost: Math.max(...fetchSpecification.costRange),
        },
      );
    }
    return query;
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Project>,
    fetchSpecification: ProjectFetchSpecification,
  ): Promise<SelectQueryBuilder<Project>> {
    return this.applySearchFiltersToQueryBuilder(query, fetchSpecification);
  }

  public async findAllProjectsKeyCosts(
    fetchSpecification: ProjectFetchSpecification,
  ) {
    fetchSpecification.fields = [...PROJECT_KEY_COSTS_FIELDS];
    return this.findAllPaginated(fetchSpecification);
  }

  public async getProjectsFiltersBounds(
    fetchSpecification: ProjectFetchSpecification,
  ): Promise<ProjectsFiltersBoundsDto> {
    const defaultBounds = await this.getDefaultBounds();
    const filtersBounds = await this.getFiltersBounds(fetchSpecification);

    if (filtersBounds.cost.min === 0 && filtersBounds.cost.max === 0) {
      filtersBounds.cost = defaultBounds.cost;
    }
    if (
      filtersBounds.abatementPotential.min === 0 &&
      filtersBounds.abatementPotential.max === 0
    ) {
      filtersBounds.abatementPotential = defaultBounds.abatementPotential;
    }

    return filtersBounds;
  }

  private async getDefaultBounds(): Promise<ProjectsFiltersBoundsDto> {
    const costBounds = await this.dataSource
      .createQueryBuilder()
      .select('MAX(total_cost)', 'maxCost')
      .addSelect('MIN(total_cost)', 'minCost')
      .from(Project, 'project')
      .execute();

    const abatementBounds = await this.dataSource
      .createQueryBuilder()
      .select('MAX(abatement_potential)', 'maxAbatementPotential')
      .addSelect('MIN(abatement_potential)', 'minAbatementPotential')
      .from(Project, 'project')
      .execute();

    return {
      cost: {
        min: Number(costBounds[0].minCost),
        max: Number(costBounds[0].maxCost),
      },
      abatementPotential: {
        min: Number(abatementBounds[0].minAbatementPotential),
        max: Number(abatementBounds[0].maxAbatementPotential),
      },
    };
  }

  private async getFiltersBounds(
    fetchSpecification: ProjectFetchSpecification,
  ): Promise<ProjectsFiltersBoundsDto> {
    const qb = this.dataSource.createQueryBuilder();
    this.setFilters(qb, fetchSpecification.filter);
    this.applySearchFiltersToQueryBuilder(qb, fetchSpecification);

    qb.select('MAX(abatement_potential)', 'maxAbatementPotential').addSelect(
      'MIN(abatement_potential)',
      'minAbatementPotential',
    );

    switch (fetchSpecification.costRangeSelector) {
      case 'npv':
        qb.addSelect('MAX(total_cost_npv)', 'maxCost');
        qb.addSelect('MIN(total_cost_npv)', 'minCost');
        break;
      case 'total':
      default:
        qb.addSelect('MAX(total_cost)', 'maxCost');
        qb.addSelect('MIN(total_cost)', 'minCost');
        break;
    }
    const filterBounds = await qb.from(Project, 'project').execute();

    return {
      abatementPotential: {
        min: Number(filterBounds[0].minAbatementPotential),
        max: Number(filterBounds[0].maxAbatementPotential),
      },
      cost: {
        min: Number(filterBounds[0].minCost),
        max: Number(filterBounds[0].maxCost),
      },
    };
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const costs = await this.projectCalculation.computeCostForProject(dto);
    const projectSize = await this.dataSource
      .getRepository(ProjectSize)
      .findOne({
        select: ['sizeHa'],
        where: {
          ecosystem: dto.ecosystem,
          activity: dto.activity,
          countryCode: dto.countryCode,
        },
      });
    const scoreCardRating = await this.scorecard.getRating(dto);
    // TODO: Not clear if sizeHa has to come from the DTO or be retrieved from the database. Does it make sense to have it in the DB?
    //       Would make sense to have thresholds defined?
    const projectBuilder = new ProjectBuilder(
      dto,
      scoreCardRating,
      costs,
      projectSize.sizeHa,
    );
    return projectBuilder.build();
  }

  async createFromExcel(fromExcel: ExcelProject[]): Promise<void> {
    this.logger.log(
      `Computing ${fromExcel.length} projects from Excel file...`,
    );
    await Promise.all(
      fromExcel.map(async (projectFromExcel) => {
        const createProjectDto =
          ProjectBuilder.excelInputToDto(projectFromExcel);
        const project = await this.create(createProjectDto);
        return this.repository.save(project);
      }),
    );
    this.logger.warn(`Computed and saved ${fromExcel.length} projects`);
  }
}

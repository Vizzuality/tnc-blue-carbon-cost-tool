import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { COST_TYPE_SELECTOR, Project } from '@shared/entities/projects.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { PaginatedProjectsWithMaximums } from '@shared/dtos/projects/projects.dto';
import { PROJECT_KEY_COSTS_FIELDS } from '@shared/dtos/projects/project-key-costs.dto';
import { ProjectsFiltersBoundsDto } from '@shared/dtos/projects/projects-filters-bounds.dto';

export type ProjectFetchSpecificacion = z.infer<typeof getProjectsQuerySchema>;

@Injectable()
export class ProjectsService extends AppBaseService<
  Project,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    public readonly projectRepository: Repository<Project>,
  ) {
    super(projectRepository, 'project', 'projects');
  }

  public async findAllProjectsWithMaximums(
    query: ProjectFetchSpecificacion,
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
    fetchSpecification: ProjectFetchSpecificacion,
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
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<SelectQueryBuilder<Project>> {
    return this.applySearchFiltersToQueryBuilder(query, fetchSpecification);
  }

  public async findAllProjectsKeyCosts(
    fetchSpecification: ProjectFetchSpecificacion,
  ) {
    fetchSpecification.fields = [...PROJECT_KEY_COSTS_FIELDS];
    return this.findAllPaginated(fetchSpecification);
  }

  public async getProjectsFiltersBounds(
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<ProjectsFiltersBoundsDto> {
    const defaultBounds = await this.getDefaultBounds();
    let filtersBounds = await this.getFiltersBounds(fetchSpecification);

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
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<ProjectsFiltersBoundsDto> {
    let qb = this.dataSource.createQueryBuilder();
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
}

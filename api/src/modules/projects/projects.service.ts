import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { COST_TYPE_SELECTOR, Project } from '@shared/entities/projects.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { PaginatedProjectsWithMaximums } from '@shared/dtos/projects/projects.dto';

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
    // Elena told us that the maximum values of the abatement_potential and max_total_cost bars is the sum of all values of the filtered results
    const qb = this.dataSource
      .createQueryBuilder()
      .select('SUM(abatement_potential)::BIGINT', 'maxAbatementPotential')
      .from(Project, 'project');

    const { costRangeSelector } = query;
    if (costRangeSelector == COST_TYPE_SELECTOR.NPV) {
      qb.addSelect('SUM(capex_npv + opex_npv)::BIGINT', 'maxTotalCost');
    } else {
      qb.addSelect('SUM(capex + opex)::BIGINT', 'maxTotalCost');
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
}

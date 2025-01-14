import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { ProjectKeyCostsView } from '@shared/entities/project-key-costs.view';
import { ProjectScorecardView } from '@shared/entities/project-scorecard.view';

export type ProjectFetchSpecificacion = z.infer<typeof getProjectsQuerySchema>;

@Injectable()
export class ProjectsKeyCostsService extends AppBaseService<
  ProjectKeyCostsView,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(ProjectScorecardView)
    public readonly projectScorecardViewRepo: Repository<ProjectScorecardView>,
  ) {
    super(projectScorecardViewRepo);
  }

  private applySearchFiltersToQueryBuilder(
    query: SelectQueryBuilder<ProjectScorecardView>,
    fetchSpecification: ProjectFetchSpecificacion,
  ): SelectQueryBuilder<ProjectScorecardView> {
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
    query: SelectQueryBuilder<ProjectScorecardView>,
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<SelectQueryBuilder<ProjectScorecardView>> {
    return this.applySearchFiltersToQueryBuilder(query, fetchSpecification);
  }
}

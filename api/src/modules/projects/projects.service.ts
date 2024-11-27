import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { z } from 'zod';
import { getProjectsQuerySchema } from '@shared/contracts/projects.contract';
import { ProjectScorecardView } from '@shared/entities/project-scorecard.view';
import {
  OtherProjectFilters,
  ProjectFilters,
} from '@shared/dtos/projects/projects-map.dto';

export type ProjectFetchSpecificacion = z.infer<typeof getProjectsQuerySchema>;

@Injectable()
export class ProjectsService extends AppBaseService<
  Project,
  unknown,
  unknown,
  unknown
> {
  constructor(
    @InjectRepository(Project)
    public readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectScorecardView)
    private readonly projectScorecardRepo: Repository<ProjectScorecardView>,
  ) {
    super(projectRepository, 'project', 'projects');
  }

  async getProjectsScorecard(
    filters?: ProjectFilters,
    otherFilters?: OtherProjectFilters,
  ): Promise<ProjectScorecardView[]> {
    const queryBuilder = this.projectScorecardRepo
      .createQueryBuilder()
      .select();

    const scorecards = this.applyScorecardFilters(
      queryBuilder,
      filters,
      otherFilters,
    ).getRawMany();

    return scorecards;
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Project>,
    fetchSpecification: ProjectFetchSpecificacion,
  ): Promise<SelectQueryBuilder<Project>> {
    // Filter by project name
    if (fetchSpecification.partialProjectName) {
      query = query.andWhere('project_name ILIKE :projectName', {
        projectName: `%${fetchSpecification.partialProjectName}%`,
      });
    }

    // Filter by abatement potential
    if (fetchSpecification.abatementPotentialRange) {
      query = query.andWhere(
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

      query = query.andWhere(
        `${filteredCostColumn} >= :minCost AND ${filteredCostColumn} <= :maxCost`,
        {
          minCost: Math.min(...fetchSpecification.costRange),
          maxCost: Math.max(...fetchSpecification.costRange),
        },
      );
    }

    return query;
  }

  private applyScorecardFilters(
    queryBuilder: SelectQueryBuilder<ProjectScorecardView>,
    filters: ProjectFilters = {},
    otherFilters: OtherProjectFilters = {},
  ) {
    const {
      countryCode,
      totalCost,
      abatementPotential,
      activity,
      activitySubtype,
      ecosystem,
    } = filters;
    const { costRange, abatementPotentialRange, costRangeSelector } =
      otherFilters;
    if (countryCode?.length) {
      queryBuilder.andWhere('country_code IN (:...countryCodes)', {
        countryCodes: countryCode,
      });
    }
    if (totalCost?.length) {
      const maxTotalCost = Math.max(...totalCost);
      queryBuilder.andWhere('total_cost <= :maxTotalCost', {
        maxTotalCost,
      });
    }
    if (abatementPotential?.length) {
      const maxAbatementPotential = Math.max(...abatementPotential);
      queryBuilder.andWhere('abatement_potential <= :maxAbatementPotential', {
        maxAbatementPotential,
      });
    }
    if (activity) {
      queryBuilder.andWhere('activity IN (:...activity)', {
        activity,
      });
    }
    if (activitySubtype?.length) {
      queryBuilder.andWhere('activity_subtype IN (:...activitySubtype)', {
        activitySubtype,
      });
    }

    if (ecosystem) {
      queryBuilder.andWhere('ecosystem IN (:...ecosystem)', {
        ecosystem,
      });
    }
    if (abatementPotentialRange) {
      queryBuilder.andWhere(
        'abatement_potential >= :minAP AND abatement_potential <= :maxAP',
        {
          minAP: Math.min(...abatementPotentialRange),
          maxAP: Math.max(...abatementPotentialRange),
        },
      );
    }

    if (costRange && costRangeSelector) {
      let filteredCostColumn: string;
      switch (costRangeSelector) {
        case 'npv':
          filteredCostColumn = 'total_cost_npv';
          break;
        case 'total':
        default:
          filteredCostColumn = 'total_cost';
          break;
      }

      queryBuilder.andWhere(
        `${filteredCostColumn} >= :minCost AND ${filteredCostColumn} <= :maxCost`,
        {
          minCost: Math.min(...costRange),
          maxCost: Math.max(...costRange),
        },
      );
    }

    return queryBuilder;
  }
}

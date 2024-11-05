import { FetchSpecification } from 'nestjs-base-service';
import { Injectable } from '@nestjs/common';
import { AppBaseService } from '@api/utils/app-base.service';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

interface ExtendedFetchSpecification extends FetchSpecification {
  otherFilters?: {
    abatementPotential?: number[];
    cost?: number[];
    totalCost?: 'npv' | 'total';
  };
}

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
  ) {
    super(projectRepository, 'project', 'projects');
  }

  async extendFindAllQuery(
    query: SelectQueryBuilder<Project>,
    fetchSpecification: ExtendedFetchSpecification,
  ): Promise<SelectQueryBuilder<Project>> {
    // Filter by project name
    if (fetchSpecification?.filter?.projectName) {
      query = query.andWhere('project_name ILIKE :projectName', {
        projectName: `%${fetchSpecification.filter.projectName}%`,
      });
    }

    // Filter by abatement potential
    if (this.isAbatementPotentialFilterValid(fetchSpecification)) {
      query = query.andWhere(
        'abatement_potential >= :minAP AND abatement_potential <= :maxAP',
        {
          minAP: fetchSpecification.otherFilters.abatementPotential[0],
          maxAP: fetchSpecification.otherFilters.abatementPotential[1],
        },
      );
    }

    // Filter by cost (total or NPV)
    if (this.isCostFilterValid(fetchSpecification)) {
      let filteredCostColumn: string;
      switch (fetchSpecification.otherFilters.totalCost) {
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
          minCost: fetchSpecification.otherFilters.cost[0],
          maxCost: fetchSpecification.otherFilters.cost[1],
        },
      );
    }
    return query;
  }

  private isCostFilterValid(
    fetchSpecification: ExtendedFetchSpecification,
  ): boolean {
    return !!(
      fetchSpecification?.otherFilters?.cost &&
      fetchSpecification?.otherFilters?.cost.length === 2 &&
      fetchSpecification?.otherFilters?.cost[0] <=
        fetchSpecification?.otherFilters?.cost[1] &&
      fetchSpecification?.otherFilters?.totalCost
    );
  }

  private isAbatementPotentialFilterValid(
    fetchSpecification: ExtendedFetchSpecification,
  ): boolean {
    return !!(
      fetchSpecification?.otherFilters?.abatementPotential &&
      fetchSpecification?.otherFilters?.abatementPotential.length === 2 &&
      fetchSpecification?.otherFilters?.abatementPotential[0] <=
        fetchSpecification?.otherFilters?.abatementPotential[1]
    );
  }
}

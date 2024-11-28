import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OtherProjectFilters,
  ProjectFilters,
} from '@shared/dtos/projects/projects-map.dto';

import { ProjectScorecardDto } from '@shared/dtos/projects/projects-scorecard.dto';

@Injectable()
export class ProjectsScorecardRepository extends Repository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {
    super(projectRepo.target, projectRepo.manager, projectRepo.queryRunner);
  }

  async getProjectsScorecard(
    filters?: ProjectFilters,
    otherFilters?: OtherProjectFilters,
  ): Promise<ProjectScorecardDto[]> {
    const queryBuilder = this.manager.createQueryBuilder();
    queryBuilder
      .select(
        `p.country_code AS countryCode,
	p.ecosystem AS ecosystem,
    p.activity AS activity,
    p.restoration_activity AS activitySubtype,
    p.project_name AS projectName,
	ps.financial_feasibility AS financialFeasibility,
    ps.legal_feasibility AS legalFeasibility,
    ps.implementation_feasibility AS implementationFeasibility,
    ps.social_feasibility AS socialFeasibility,
    ps.security_rating AS securityRating,
    ps.availability_of_experienced_labor AS availabilityOfExperiencedLabor,
    ps.availability_of_alternating_funding AS availabilityOfAlternatingFunding,
    ps.coastal_protection_benefits AS coastalProtectionBenefits,
    ps.biodiversity_benefit AS biodiversityBenefit,
    p.abatement_potential AS abatementPotential,
    p.total_cost AS totalCost,
    p.total_cost_npv AS totalCostNPV`,
      )
      .from('projects', 'p')
      .leftJoin(
        'project_scorecard',
        'ps',
        'p.country_code = ps.country_code and ps."ecosystem"::VARCHAR = p."ecosystem"::VARCHAR',
      );

    const projectScorecards = await this.applyScorecardFilters(
      queryBuilder,
      filters,
      otherFilters,
    ).getRawMany();

    return projectScorecards;
  }

  private applyScorecardFilters(
    queryBuilder: SelectQueryBuilder<Project>,
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
      queryBuilder.andWhere('countryCode IN (:...countryCodes)', {
        countryCodes: countryCode,
      });
    }
    if (totalCost?.length) {
      const maxTotalCost = Math.max(...totalCost);
      queryBuilder.andWhere('totalCost <= :maxTotalCost', {
        maxTotalCost,
      });
    }
    if (abatementPotential?.length) {
      const maxAbatementPotential = Math.max(...abatementPotential);
      queryBuilder.andWhere('p.abatement_potential <= :maxAbatementPotential', {
        maxAbatementPotential,
      });
    }
    if (activity) {
      queryBuilder.andWhere('activity IN (:...activity)', {
        activity,
      });
    }
    if (activitySubtype?.length) {
      queryBuilder.andWhere('p.restoration_activity IN (:...activitySubtype)', {
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
        'p.abatemen_potential >= :minAP AND p.abatement_potential <= :maxAP',
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
          filteredCostColumn = 'p.total_cost_npv';
          break;
        case 'total':
        default:
          filteredCostColumn = 'p.total_cost';
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

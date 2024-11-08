import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OtherMapFilters,
  ProjectMap,
  ProjectMapFilters,
} from '@shared/dtos/projects/projects-map.dto';

@Injectable()
export class ProjectsMapRepository extends Repository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {
    super(projectRepo.target, projectRepo.manager, projectRepo.queryRunner);
  }

  async getProjectsMap(
    filters?: ProjectMapFilters,
    otherFilters?: OtherMapFilters,
  ): Promise<ProjectMap> {
    const geoQueryBuilder = this.manager.createQueryBuilder();
    geoQueryBuilder
      .select(
        `
    json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(
            json_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(country.geometry)::jsonb, 
                'properties', json_build_object(
                    'country', country.name,
                    'abatementPotential', filtered_projects.total_abatement_potential,
                    'cost', filtered_projects.total_cost
                )
            )
        )
    ) as geojson
    `,
      )
      .from('countries', 'country')
      .innerJoin(
        (subQuery) => {
          subQuery
            .select('p.country_code')
            .from(Project, 'p')
            .addSelect(
              'SUM(p.abatement_potential)',
              'total_abatement_potential',
            )
            .groupBy('p.country_code');

          return this.applyFilters(subQuery, filters, otherFilters);
        },
        'filtered_projects',
        'filtered_projects.country_code = country.code',
      );

    const { geojson } = await geoQueryBuilder.getRawOne<{
      geojson: ProjectMap;
    }>();
    return geojson;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Project>,
    filters: ProjectMapFilters = {},
    otherFilters: OtherMapFilters = {},
  ) {
    const {
      countryCode,
      totalCost,
      abatementPotential,
      activity,
      activitySubtype,
      ecosystem,
      projectSizeFilter,
      priceType,
    } = filters;
    const { costRange, abatementPotentialRange, costRangeSelector } =
      otherFilters;

    if (costRangeSelector === 'npv') {
      queryBuilder.addSelect('SUM(p.total_cost_npv)', 'total_cost');
    } else {
      queryBuilder.addSelect('SUM(p.total_cost)', 'total_cost');
    }

    if (countryCode?.length) {
      queryBuilder.andWhere('p.countryCode IN (:...countryCodes)', {
        countryCodes: countryCode,
      });
    }
    if (totalCost?.length) {
      const maxTotalCost = Math.max(...totalCost);
      queryBuilder.andWhere('p.totalCost <= :maxTotalCost', {
        maxTotalCost,
      });
    }
    if (abatementPotential?.length) {
      const maxAbatementPotential = Math.max(...abatementPotential);
      queryBuilder.andWhere('p.abatementPotential <= :maxAbatementPotential', {
        maxAbatementPotential,
      });
    }
    if (activity) {
      queryBuilder.andWhere('p.activity IN (:...activity)', {
        activity,
      });
    }
    if (activitySubtype?.length) {
      queryBuilder.andWhere('p.activitySubtype IN (:...activitySubtype)', {
        activitySubtype,
      });
    }

    if (ecosystem) {
      queryBuilder.andWhere('p.ecosystem IN (:...ecosystem)', {
        ecosystem,
      });
    }
    if (abatementPotentialRange) {
      queryBuilder.andWhere(
        'p.abatementPotential >= :minAP AND p.abatementPotential <= :maxAP',
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
          filteredCostColumn = 'p.totalCostNPV';
          break;
        case 'total':
        default:
          filteredCostColumn = 'p.totalCost';
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

    // TODO: Pending to apply "parameter" filters (size, price type, NPV vs non-NPV)...
    return queryBuilder;
  }
}

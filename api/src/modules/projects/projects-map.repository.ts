import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
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

  async getProjectsMap(filters?: ProjectMapFilters): Promise<ProjectMap> {
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
            .addSelect('SUM(p.total_cost)', 'total_cost')
            .groupBy('p.country_code');

          return this.applyFilters(subQuery, filters);
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

    // TODO: Pending to apply "parameter" filters (size, price type, NPV vs non-NPV)...
    return queryBuilder;
  }
}

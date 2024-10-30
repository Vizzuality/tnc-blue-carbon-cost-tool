import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectMap } from '@shared/dtos/projects/projects-map.dto';

@Injectable()
export class ProjectsMapRepository extends Repository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {
    super(projectRepo.target, projectRepo.manager, projectRepo.queryRunner);
  }

  async getProjectsMap(): Promise<ProjectMap> {
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
          return subQuery
            .select('p.country_code')
            .from(Project, 'p')
            .addSelect(
              'SUM(p.abatement_potential)',
              'total_abatement_potential',
            )
            .addSelect('SUM(p.total_cost)', 'total_cost')
            .groupBy('p.country_code');
        },
        'filtered_projects',
        'filtered_projects.country_code = country.code',
      );

    const { geojson } = await geoQueryBuilder.getRawOne<{
      geojson: ProjectMap;
    }>();
    return geojson;
  }
}

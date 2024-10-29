import { Injectable, Logger } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/entities/country.entity';
import { FeatureCollection } from 'geojson';

/**
 * @description: The aim for this repository is to work with geospatial data. Since we need to join with different entities and apply different filters
 * depending on the joint entity, this repository returns a queryBuilder that can be used to retrieve all geometries by default, and/or to build
 * a custom query with joins and filters.
 */

@Injectable()
export class MapRepository extends Repository<Country> {
  logger: Logger = new Logger(MapRepository.name);
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getGeoFeaturesQueryBuilder(
    propertiesSubQuery: string,
  ): SelectQueryBuilder<FeatureCollection> {
    const queryBuilder = this.createQueryBuilder('country');
    queryBuilder.select(
      `
        json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Simplify(country.geometry, 0.01))::jsonb, 
              'properties', json_build_object(${propertiesSubQuery})
            )
          )
        )`,
      'geojson',
    );
    return queryBuilder as unknown as SelectQueryBuilder<FeatureCollection>;
  }
}

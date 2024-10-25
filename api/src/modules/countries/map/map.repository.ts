import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureCollection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/entities/country.entity';
import { BaseData } from '@shared/entities/base-data.entity';

/**
 * @description: The aim for this repository is to work with geospatial data, for now "geometry" column in countries
 * table. The country repository will be used to work with the metadata of the countries and avoid loading geometries when only metadata is needed,
 * which can consume a lot of resources.
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

  async getGeoFeatures(
    countryCode: Country['code'],
  ): Promise<FeatureCollection> {
    const queryBuilder = this.createQueryBuilder('country');
    queryBuilder.innerJoin(BaseData, 'bd', 'bd.country_code = country.code');
    queryBuilder.select(
      `
        json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
            json_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Simplify(country.geometry, 0.01))::jsonb, 
              'properties', json_build_object(${this.getPropertiesQuery()})
            )
          )
        )`,
      'geojson',
    );
    if (countryCode) {
      queryBuilder.where('country.code = :countryCode', {
        countryCode,
      });
    }

    const result: { geojson: FeatureCollection } | undefined =
      await queryBuilder.getRawOne<{
        geojson: FeatureCollection;
      }>();
    this.logger.log(`Retrieved geo features`);
    if (!result) {
      throw new NotFoundException(`Could not retrieve geo features`);
    }
    return result.geojson;
  }

  private getPropertiesQuery(): string {
    return `'country', country.name,
            'abatementPotential', 10000,
            'cost', 20000`;
  }
}

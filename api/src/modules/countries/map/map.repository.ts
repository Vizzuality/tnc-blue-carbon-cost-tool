import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@shared/entities/countries/country.entity';
import { GeoJSON } from 'geojson';

/**
 * @description: The aim for this repository is to work with geospatial data, for now "geometry" column in countries
 * table. The country repository will be used to work with the metadata of the countries and avoid loading geometries when only metadata is needed,
 * which can consume a lot of resources.
 */

@Injectable()
export class MapRepository extends Repository<Country> {
  constructor(
    @InjectRepository(Country)
    private readonly repository: Repository<Country>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getGeoJson(countryCode: Country['countryCode']): Promise<GeoJSON> {
    const res = await this.createQueryBuilder('country')
      .select('ST_AsGeoJSON(country.geometry)', 'geojson')
      //.where('country.country_code = :countryCode', { countryCode: 'ESP' })
      .getRawMany();

    console.log(res);
    return res as unknown as GeoJSON;
  }
}

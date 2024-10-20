import { Controller, Get, Query } from '@nestjs/common';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { Country } from '@shared/entities/countries/country.entity';
import { GeoJSON } from 'geojson';

@Controller('map')
export class MapController {
  constructor(private readonly mapRepository: MapRepository) {}
  @Get('/geojson')
  getGeoJson(
    @Query('countryCode') countryCode: Country['countryCode'],
  ): Promise<GeoJSON> {
    return this.mapRepository.getGeoJson(countryCode);
  }
}

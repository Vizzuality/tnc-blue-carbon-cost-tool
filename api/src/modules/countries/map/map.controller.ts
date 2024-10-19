import { Controller, Get } from '@nestjs/common';

@Controller('map')
export class MapController {
  @Get('/geojson')
  getGeoJson() {
    return 'This will return the geojson of the countries';
  }
}

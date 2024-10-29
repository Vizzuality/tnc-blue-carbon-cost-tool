import { Controller, HttpStatus } from '@nestjs/common';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { mapContract } from '@shared/contracts/map.contract';
import { FeatureCollection } from 'geojson';

@Controller()
export class MapController {
  constructor(private readonly mapRepository: MapRepository) {}

  @TsRestHandler(mapContract.getGeoFeatures)
  async getGeoFeatures(): ControllerResponse {
    return tsRestHandler(mapContract.getGeoFeatures, async ({ query }) => {
      const propertiesSubQuery = `'country', country.name`;
      const queryBuilder =
        this.mapRepository.getGeoFeaturesQueryBuilder(propertiesSubQuery);
      if (query.countryCode) {
        queryBuilder.where('country.code = :countryCode', {
          countryCode: query.countryCode,
        });
      }
      const { geojson } = await queryBuilder.getRawOne<{
        geojson: FeatureCollection;
      }>();
      return { body: geojson, status: HttpStatus.OK };
    });
  }
}

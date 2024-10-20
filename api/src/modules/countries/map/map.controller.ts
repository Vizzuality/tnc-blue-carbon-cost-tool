import { Controller, HttpStatus } from '@nestjs/common';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { mapContract } from '@shared/contracts/map.contract';

@Controller()
export class MapController {
  constructor(private readonly mapRepository: MapRepository) {}

  @TsRestHandler(mapContract.getGeoFeatures)
  async getGeoFeatures(): ControllerResponse {
    return tsRestHandler(mapContract.getGeoFeatures, async ({ query }) => {
      const geoFeatures = await this.mapRepository.getGeoFeatures(
        query.countryCode,
      );
      return { body: geoFeatures, status: HttpStatus.OK };
    });
  }
}

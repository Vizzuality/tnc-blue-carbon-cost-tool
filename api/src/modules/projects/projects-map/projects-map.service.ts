import { Injectable, NotFoundException } from '@nestjs/common';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { IMapService } from '@api/modules/countries/map/map-service.interface';
import { Project } from '@shared/entities/projects.entity';

@Injectable()
export class ProjectsMapService implements IMapService {
  mapRepository: MapRepository;
  constructor(mapRepo: MapRepository) {
    this.mapRepository = mapRepo;
  }

  async getMap<ProjectMap>() {
    const mapQueryBuilder = this.mapRepository.getGeoFeaturesQueryBuilder(
      this.getGeoPropertiesQuery(),
    );
    mapQueryBuilder.leftJoin(
      Project,
      'project',
      'project.countryCode = country.code',
    );
    const result:
      | {
          geojson: ProjectMap;
        }
      | undefined = await mapQueryBuilder.getRawOne<{
      geojson: ProjectMap;
    }>();
    if (!result) {
      throw new NotFoundException(`Could not retrieve geo features`);
    }
    return result.geojson;
  }

  getGeoPropertiesQuery(): string {
    return `'country', country.name,
            'abatementPotential', project.abatementPotential,
            'cost', project.totalCost`;
  }
}

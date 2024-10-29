import { Injectable, NotFoundException } from '@nestjs/common';
import { MapRepository } from '@api/modules/countries/map/map.repository';
import { IMapService } from '@api/modules/countries/map/map-service.interface';
import { Project } from '@shared/entities/projects.entity';
import { ProjectMapFilters } from '@shared/contracts/projects.contract';

@Injectable()
export class ProjectsMapService implements IMapService {
  mapRepository: MapRepository;
  constructor(mapRepo: MapRepository) {
    this.mapRepository = mapRepo;
  }

  async getMap<ProjectMap>(filters: ProjectMapFilters) {
    const mapQueryBuilder = this.mapRepository.getGeoFeaturesQueryBuilder(
      this.getGeoPropertiesQuery(),
    );
    mapQueryBuilder.leftJoin(
      Project,
      'project',
      'project.countryCode = country.code',
    );

    if (filters.countryCodes.length) {
      mapQueryBuilder.andWhere('project.countryCode IN (:...countryCodes)', {
        countryCodes: filters.countryCodes,
      });
    }
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

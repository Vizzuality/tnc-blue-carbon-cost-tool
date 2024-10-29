import { MapRepository } from '@api/modules/countries/map/map.repository';

export const IMapServiceToken = Symbol('IMapService');

export interface IMapService {
  mapRepository: MapRepository;

  getMap<T>(filters?: Record<any, any>): Promise<T>;

  getGeoPropertiesQuery(): string;
}

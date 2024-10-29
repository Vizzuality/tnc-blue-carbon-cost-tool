import { MapRepository } from '@api/modules/countries/map/map.repository';
import { FeatureCollection } from 'geojson';

export const IMapServiceToken = Symbol('IMapService');

export interface IMapService {
  mapRepository: MapRepository;

  getMap(filters?: Record<any, any>): Promise<FeatureCollection>;

  getGeoPropertiesQuery(): string;
}

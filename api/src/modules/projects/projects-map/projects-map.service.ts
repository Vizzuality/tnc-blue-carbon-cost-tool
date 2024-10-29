// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Project } from '@shared/entities/projects.entity';
// import { ProjectMapFilters } from '@shared/contracts/projects.contract';
// import { ProjectMap } from '@shared/dtos/projects/projects-map.dto';
//
// @Injectable()
// export class ProjectsMapService {
//   constructor() {}
//
//   async getMap(filters: ProjectMapFilters) {
//     const mapQueryBuilder = this.mapRepository.getGeoFeaturesQueryBuilder(
//       this.getGeoPropertiesQuery(),
//     );
//     mapQueryBuilder.leftJoin(
//       Project,
//       'project',
//       'project.countryCode = country.code',
//     );
//
//     if (filters?.countryCodes.length) {
//       mapQueryBuilder.andWhere('project.countryCode IN (:...countryCodes)', {
//         countryCodes: filters.countryCodes,
//       });
//     }
//
//     console.log('QUERY BUILDER', mapQueryBuilder.getSql());
//     const result:
//       | {
//           geojson: ProjectMap;
//         }
//       | undefined = await mapQueryBuilder.getRawOne<{
//       geojson: ProjectMap;
//     }>();
//     if (!result) {
//       throw new NotFoundException(`Could not retrieve geo features`);
//     }
//     console.log('FEATURES IN PROJECTS MAP', result.geojson.features.length);
//     return result.geojson;
//   }
//
//   getGeoPropertiesQuery(): string {
//     return `'country', country.name,
//             'abatementPotential', sum(project.abatementPotential),
//             'cost', sum(project.totalCost)`;
//   }
// }

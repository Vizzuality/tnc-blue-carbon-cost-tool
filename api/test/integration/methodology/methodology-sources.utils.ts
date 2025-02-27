import { MethodologySourcesDto } from '@shared/dtos/methodology/methodology-sources.dto';

export const MethodologySourcesUtils = {
  removeSourceIds: (methodologySources: MethodologySourcesDto) => {
    for (const sourcesCategory of methodologySources) {
      for (const sourceData of sourcesCategory.sourcesByComponentName) {
        if (Array.isArray(sourceData.sources) === true) {
          for (const source of sourceData.sources) {
            delete source.id;
          }
        } else {
          if (sourceData.sources === null) continue;

          for (const key of Object.keys(sourceData.sources)) {
            for (const source of sourceData.sources[key]) {
              delete source.id;
            }
          }
        }
      }
    }
  },
};

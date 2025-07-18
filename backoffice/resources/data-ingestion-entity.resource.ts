import { DataIngestionEntity } from '@shared/entities/model-versioning/data-ingestion.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { version } from 'os';

export const DataIngestionEntityResource: ResourceWithOptions = {
  resource: DataIngestionEntity,
  options: {
    sort: {
      sortBy: 'createdAt',
      direction: 'desc',
    },
    navigation: {
      name: 'Methodology',
      icon: 'Layers',
    },
    actions: {
      new: { isVisible: false, isAccessible: false },
      // edit: { isVisible: false, isAccessible: false },
    },
    properties: {
      createdAt: {
        isDisabled: true,
      },
      versionName: {
        isTitle: true,
        isDisabled: true,
      },
      versionNotes: {
        type: 'richtext',
      },
    },
  },
};

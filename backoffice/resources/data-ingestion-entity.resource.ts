import { DataIngestionEntity } from '@shared/entities/model-versioning/data-ingestion.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { Components } from 'backoffice/components/index.js';

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
    showProperties: ['createdAt', 'versionName', 'versionNotes', 'filePath'],
    editProperties: ['versionName', 'versionNotes', 'filePath'],
    listProperties: ['createdAt', 'versionName', 'versionNotes', 'filePath'],
    filterProperties: ['createdAt', 'versionName'],
    actions: {
      new: { isVisible: false, isAccessible: false },
      // edit: { isVisible: false, isAccessible: false },
    },
    translations: {
      en: {
        properties: {
          filePath: 'File',
        },
      },
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
      filePath: {
        components: {
          edit: Components.DownloadDataIngestionFile,
          show: Components.DownloadDataIngestionFile,
          list: Components.DownloadDataIngestionFile,
        },
        isDisabled: true,
      },
    },
  },
};

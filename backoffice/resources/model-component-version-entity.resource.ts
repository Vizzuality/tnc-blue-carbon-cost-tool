import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity.js';
import { ResourceWithOptions } from 'adminjs';
import { Components } from 'backoffice/components/index.js';

export const ModelComponentsVersionEntityResource: ResourceWithOptions = {
  resource: ModelComponentsVersionEntity,
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
        labels: {
          ModelComponentsVersionEntity: 'Model factors Versions',
        },
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
        components: {
          edit: Components.CustomRichTextEditor,
          show: Components.HtmlDisplay,
          list: Components.HtmlDisplay,
        },
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

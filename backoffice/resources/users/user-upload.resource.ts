import { UserUpload } from '@shared/entities/users/user-upload.js';
import { ResourceWithOptions } from 'adminjs';
import { Components } from 'backoffice/components/index.js';
import { GLOBAL_COMMON_PROPERTIES } from 'backoffice/resources/common/common.resources.js';
import { UserUploadActions } from 'backoffice/resources/users/user-upload.actions.js';

const FIELD_NAMES = ['user', 'uploadedAt', 'files'];

export const UserUploadResource: ResourceWithOptions = {
  resource: UserUpload,
  options: {
    translations: {
      en: {
        labels: {
          UserUpload: 'File submissions',
        },
      },
    },
    navigation: {
      name: 'User Management',
      icon: 'User',
    },
    showProperties: FIELD_NAMES,
    editProperties: FIELD_NAMES,
    listProperties: FIELD_NAMES,
    filterProperties: ['user', 'uploadedAt'],
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      files: {
        components: {
          edit: Components.DownloadUserFiles,
          show: Components.DownloadUserFiles,
          list: Components.DownloadUserFiles,
        },
      },
    },
    actions: {
      new: {
        isVisible: false,
      },
      edit: {
        isVisible: false,
      },
      delete: {
        isVisible: true,
        before: UserUploadActions.deleteBeforeHook,
        after: UserUploadActions.deleteAfterHook,
      },
      bulkDelete: {
        isVisible: false,
        isAccessible: false,
      },
    },
  },
};

import { ResourceOptions } from 'adminjs';

export const GLOBAL_COMMON_PROPERTIES: ResourceOptions['properties'] = {
  id: {
    isId: true,
    isVisible: { list: false, show: false, edit: false, filter: false },
  },
};

export const COMMON_RESOURCE_LIST_PROPERTIES: ResourceOptions['properties'] = {
  countryName: {
    position: 1,
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
  ecosystem: {
    position: 2,
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
  activity: {
    position: 3,
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
};

export const DEFAULT_READONLY_PERMISSIONS: ResourceOptions['actions'] = {
  new: { isVisible: false, isAccessible: false },
  edit: { isVisible: false, isAccessible: false },
  delete: { isVisible: false, isAccessible: false },
  bulkDelete: { isVisible: false, isAccessible: false },
};

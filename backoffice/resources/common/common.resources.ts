import { ResourceOptions } from "adminjs";

export const GLOBAL_COMMON_PROPERTIES: ResourceOptions["properties"] = {
  id: {
    isVisible: { list: false, show: false, edit: false, filter: false },
  },
};

export const COMMON_RESOURCE_LIST_PROPERTIES: ResourceOptions["properties"] = {
  countryName: {
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
  ecosystem: {
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
  activity: {
    isVisible: { list: true, show: true, edit: false, filter: true },
  },
};

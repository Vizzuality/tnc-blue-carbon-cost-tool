import { ResourceOptions } from "adminjs";

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

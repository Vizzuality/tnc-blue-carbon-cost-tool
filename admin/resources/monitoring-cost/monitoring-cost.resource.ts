import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceWithOptions,
} from "adminjs";
import { dataSource } from "../../datasource.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";
import { MonitoringCost } from "@shared/entities/monitoring.entity.js";

export const MonitoringCostResource: ResourceWithOptions = {
  resource: MonitoringCost,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: ["monitoringCost", "countryName", "ecosystem", "activity"],
    sort: {
      sortBy: "monitoringCost",
      direction: "desc",
    },
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    actions: {
      list: {
        after: async (
          request: ActionRequest,
          response: ActionResponse,
          context: ActionContext,
        ) => {
          const { records } = context;
          const baseDataRepo = dataSource.getRepository(BaseData);
          const queryBuilder = baseDataRepo
            .createQueryBuilder("baseData")
            .leftJoin(MonitoringCost, "r", "baseData.monitoringCost = r.id")
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("r.id", "id")
            .addSelect("r.monitoringCost", "monitoringCost")
            .addSelect("country.name", "countryName")
            .addSelect("baseData.ecosystem", "ecosystem")
            .addSelect("baseData.activity", "activity");

          if (records?.length) {
            queryBuilder.andWhere("r.id IN (:...ids)", {
              ids: records.map((r) => r.params.id),
            });
          }

          const result = await queryBuilder.getRawMany();

          return {
            ...request,
            records: records!.map((record: BaseRecord) => {
              record.params = result.find((q) => q.id === record.params.id);
              return record;
            }),
          };
        },
      },
    },
  },
};

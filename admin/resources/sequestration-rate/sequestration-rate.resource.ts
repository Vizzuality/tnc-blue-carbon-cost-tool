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
import { SequestrationRate } from "@shared/entities/sequestration-rate.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";

export const SequestrationRateResource: ResourceWithOptions = {
  resource: SequestrationRate,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: [
      "tierSelector",
      "tier1Factor",
      "tier2Factor",
      "countryName",
      "ecosystem",
      "activity",
    ],
    sort: {
      sortBy: "tierSelector",
      direction: "asc",
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
            .leftJoin(
              SequestrationRate,
              "r",
              "baseData.sequestrationRate = r.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("r.id", "id")
            .addSelect("r.tierSelector", "tierSelector")
            .addSelect("r.tier1Factor", "tier1Factor")
            .addSelect("r.tier2Factor", "tier2Factor")
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

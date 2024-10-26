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
import { FinancingCost } from "@shared/entities/financing-cost.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";
import { ImplementationLaborCost } from "@shared/entities/implementation-labor.entity.js";

export const ImplementationLaborCostResource: ResourceWithOptions = {
  resource: ImplementationLaborCost,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: [
      "implementationLaborCost",
      "countryName",
      "ecosystem",
      "activity",
    ],
    sort: {
      sortBy: "implementationLaborCost",
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
            .leftJoin(
              ImplementationLaborCost,
              "r",
              "baseData.implementationLaborCost = r.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("r.id", "id")
            .addSelect("r.implementationLaborCost", "implementationLaborCost")
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

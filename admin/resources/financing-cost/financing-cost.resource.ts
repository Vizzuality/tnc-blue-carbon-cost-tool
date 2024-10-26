import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceWithOptions,
} from "adminjs";
import { dataSource } from "../../datasource.js";
import { ProjectSize } from "@shared/entities/project-size.entity.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity.js";
import { FinancingCost } from "@shared/entities/financing-cost.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";

export const FinancingCostResource: ResourceWithOptions = {
  resource: FinancingCost,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: [
      "financingCostCapexPercent",
      "countryName",
      "ecosystem",
      "activity",
    ],
    sort: {
      sortBy: "financingCostCapexPercent",
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
            .leftJoin(FinancingCost, "r", "baseData.financingCost = r.id")
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("r.id", "id")
            .addSelect(
              "r.financingCostCapexPercent",
              "financingCostCapexPercent",
            )
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

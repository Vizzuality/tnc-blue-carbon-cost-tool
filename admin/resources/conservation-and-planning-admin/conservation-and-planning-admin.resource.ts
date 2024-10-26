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
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";

export const ConservationAndPlanningAdminResource: ResourceWithOptions = {
  resource: ConservationPlanningAndAdmin,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: ["planningCost", "countryName", "ecosystem", "activity"],
    sort: {
      sortBy: "planningCost",
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
              ConservationPlanningAndAdmin,
              "cpa",
              "baseData.conservationPlanningAndAdmin = cpa.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("cpa.id", "id")
            .addSelect("cpa.planningCost", "planningCost")
            .addSelect("country.name", "countryName")
            .addSelect("baseData.ecosystem", "ecosystem")
            .addSelect("baseData.activity", "activity");

          if (records?.length) {
            queryBuilder.andWhere("cpa.id IN (:...ids)", {
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

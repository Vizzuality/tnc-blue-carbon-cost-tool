import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  PropertyOptions,
  ResourceWithOptions,
} from "adminjs";
import { dataSource } from "../../datasource.js";
import { ProjectSize } from "@shared/entities/project-size.entity.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { FeasibilityAnalysis } from "@shared/entities/feasability-analysis.entity.js";
import { ConservationPlanningAndAdmin } from "@shared/entities/conservation-and-planning-admin.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES } from "../common/common.resources.js";
import { CommunityRepresentation } from "@shared/entities/community-representation.entity.js";

export const CommunityRepresentationResource: ResourceWithOptions = {
  resource: CommunityRepresentation,
  options: {
    properties: COMMON_RESOURCE_LIST_PROPERTIES,
    listProperties: ["liaisonCost", "countryName", "ecosystem", "activity"],
    sort: {
      sortBy: "liaisonCost",
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
              CommunityRepresentation,
              "r",
              "baseData.communityRepresentation = r.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("r.id", "id")
            .addSelect("r.liaisonCost", "liaisonCost")
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

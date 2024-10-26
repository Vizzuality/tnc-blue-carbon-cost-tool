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

export const FeasibilityAnalysisResource: ResourceWithOptions = {
  resource: FeasibilityAnalysis,
  options: {
    properties: {
      countryName: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      ecosystem: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      activity: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
    },
    listProperties: ["analysisScore", "countryName", "ecosystem", "activity"],
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
              FeasibilityAnalysis,
              "fa",
              "baseData.feasibilityAnalysis = fa.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("fa.id", "id")
            .addSelect("fa.analysisScore", "analysisScore")
            .addSelect("country.name", "countryName")
            .addSelect("baseData.ecosystem", "ecosystem")
            .addSelect("baseData.activity", "activity");

          if (records?.length) {
            queryBuilder.andWhere("fa.id IN (:...ids)", {
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

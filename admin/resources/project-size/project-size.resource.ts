import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceWithOptions,
} from "adminjs";
import { ProjectSize } from "@api/modules/model/entities/project-size.entity.js";
import { BaseData } from "@api/modules/model/base-data.entity.js";
import { dataSource } from "../../datasource.js";
import { Country } from "@api/modules/model/entities/country.entity.js";

export const projectSizeResource: ResourceWithOptions = {
  resource: ProjectSize,
  options: {
    properties: {
      countryName: {
        isVisible: { list: true, show: true, edit: false },
      },
      ecosystem: {
        isVisible: { list: true, show: true, edit: false },
      },
      activity: {
        isVisible: { list: true, show: true, edit: false },
      },
    },
    // Definir las propiedades que deben aparecer en la lista
    listProperties: ["sizeHa", "countryName", "ecosystem", "activity"],
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
          const testRquest = request;
          const testResponse = response;
          const { query: QueryParams } = request;
          const baseDataRepo = dataSource.getRepository(BaseData);
          const query = await baseDataRepo
            .createQueryBuilder("baseData")
            .leftJoin(
              ProjectSize,
              "projectSize",
              "baseData.projectSize = projectSize.id",
            )
            .leftJoin(
              Country,
              "country",
              "country.countryCode = baseData.countryCode",
            )
            .select("projectSize.id", "id")
            .addSelect("projectSize.sizeHa", "sizeHa")
            .addSelect("country.country", "countryName")
            .addSelect("baseData.ecosystem", "ecosystem")
            .addSelect("baseData.activity", "activity")
            .where("projectSize.id IN (:...ids)", {
              ids: records!.map((r) => r.params.id),
            })
            .getRawMany();

          return {
            ...request,
            records: records!.map((record: BaseRecord) => {
              record.params = query.find((q) => q.id === record.params.id);
              return record;
            }),
          };
        },
      },
    },
  },
};

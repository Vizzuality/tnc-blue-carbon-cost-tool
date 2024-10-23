import {
  ActionContext,
  ActionQueryParameters,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ConfigurationError,
  Filter,
  flat,
  populator,
  ResourceOptions,
  ResourceWithOptions,
} from "adminjs";
import { dataSource } from "../../datasource.js";

import { Sort } from "typeorm";
import { ProjectSize } from "@shared/entities/project-size.entity.js";
import { BaseData } from "@shared/entities/base-data.entity.js";
import { Country } from "@shared/entities/country.entity.js";

const DEFAULT_DIRECTION = "asc";

const sortSetter = (
  { direction, sortBy }: { direction?: "asc" | "desc"; sortBy?: string } = {},
  firstPropertyName: string,
  resourceOptions: ResourceOptions = {},
): Sort => {
  const options: any = resourceOptions.sort || ({} as Sort);
  if (
    resourceOptions &&
    resourceOptions.sort &&
    resourceOptions.sort.direction &&
    !["asc", "desc"].includes(resourceOptions.sort.direction)
  ) {
    throw new ConfigurationError(
      `
    Sort direction should be either "asc" or "desc",
    "${resourceOptions.sort.direction} was given"`,
      "global.html#ResourceOptions",
    );
  }
  const computedDirection =
    direction || (options.direction as Sort) || DEFAULT_DIRECTION;
  const params = {
    direction: computedDirection === "asc" ? "asc" : ("desc" as "asc" | "desc"),
    sortBy: sortBy || options.sortBy || firstPropertyName,
  };

  return params;
};

const PER_PAGE_LIMIT = 500;

export const projectSizeResource: ResourceWithOptions = {
  resource: ProjectSize,
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
          const baseDataRepo = dataSource.getRepository(BaseData);
          const queryBuilder = baseDataRepo
            .createQueryBuilder("baseData")
            .leftJoin(
              ProjectSize,
              "projectSize",
              "baseData.projectSize = projectSize.id",
            )
            .leftJoin(Country, "country", "country.code = baseData.countryCode")
            .select("projectSize.id", "id")
            .addSelect("projectSize.sizeHa", "sizeHa")
            .addSelect("country.name", "countryName")
            .addSelect("baseData.ecosystem", "ecosystem")
            .addSelect("baseData.activity", "activity");
          if (records?.length) {
            queryBuilder.where("projectSize.id IN (:...ids)", {
              ids: records.map((r) => r.params.id),
            });
          }

          // .where("projectSize.id IN (:...ids)", {
          //   ids: records!.map((r) => r.params.id),
          // })
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

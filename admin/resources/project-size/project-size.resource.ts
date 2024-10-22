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
        handler: async (request, response, context) => {
          const { query } = request;
          const {
            sortBy,
            direction,
            filters = {},
          } = flat.unflatten(query || {}) as ActionQueryParameters;
          const { resource, _admin } = context;
          let { page, perPage } = flat.unflatten(
            query || {},
          ) as ActionQueryParameters;

          if (perPage) {
            perPage = +perPage > PER_PAGE_LIMIT ? PER_PAGE_LIMIT : +perPage;
          } else {
            perPage = _admin.options.settings?.defaultPerPage ?? 10;
          }
          page = Number(page) || 1;

          const listProperties = resource.decorate().getListProperties();
          const firstProperty = listProperties.find((p) => p.isSortable());
          let sort: any;
          if (firstProperty) {
            sort = sortSetter(
              { sortBy, direction },
              firstProperty.name(),
              resource.decorate().options,
            );
          }

          const filter = await new Filter(filters, resource).populate(context);

          const { currentAdmin } = context;
          // TODO: We should manipulate the query here to apply custom filters, and remove the after hook
          const records = await resource.find(
            filter,
            {
              limit: perPage,
              offset: (page - 1) * perPage,
              sort,
            },
            context,
          );
          const populatedRecords = await populator(records, context);

          // eslint-disable-next-line no-param-reassign
          context.records = populatedRecords;

          const total = await resource.count(filter, context);
          return {
            meta: {
              total,
              perPage,
              page,
              direction: sort?.direction,
              sortBy: sort?.sortBy,
            },
            records: populatedRecords.map((r) => r.toJSON(currentAdmin)),
          };
        },
        after: async (
          request: ActionRequest,
          response: ActionResponse,
          context: ActionContext,
        ) => {
          const { records } = context;
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

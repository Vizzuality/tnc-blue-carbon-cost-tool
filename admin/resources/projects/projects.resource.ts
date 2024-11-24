import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceWithOptions,
} from "adminjs";
import { dataSource } from "../../datasource.js";
import { Project } from "@shared/entities/projects.entity.js";
import { Country } from "@shared/entities/country.entity.js";
import { COMMON_RESOURCE_LIST_PROPERTIES, GLOBAL_COMMON_PROPERTIES } from "../common/common.resources.js";

export const ProjectsResource: ResourceWithOptions = {
  resource: Project,
  options: {
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      ...COMMON_RESOURCE_LIST_PROPERTIES,
    },
    listProperties: [
      "projectName",
      "projectSize",
      "projectSizeFilter",
      "abatementPotential",
      "totalCostNPV",
      "costPerTCO2eNPV",
      "initialPriceAssumption",
      "activitySubtype",
      "projectSizeFilter",
      "priceType",
    ],
    sort: {
      sortBy: "projectName",
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
          context: ActionContext
        ) => {
          const { records } = context;
          const projectDataRepo = dataSource.getRepository(Project);
          const queryBuilder = projectDataRepo
            .createQueryBuilder("project")
            .leftJoin(Country, "country", "project.countryCode = country.code")
            .select("project.id", "id")
            .addSelect("project.projectName", "projectName")
            .addSelect("project.ecosystem", "ecosystem")
            .addSelect("project.activity", "activity")
            .addSelect("project.activitySubtype", "activitySubtype")
            .addSelect("country.name", "countryName")
            .addSelect("project.projectSize", "projectSize")
            .addSelect("project.projectSizeFilter", "projectSizeFilter")
            .addSelect("project.abatementPotential", "abatementPotential")
            .addSelect("project.totalCostNPV", "totalCostNPV")
            .addSelect("project.costPerTCO2eNPV", "costPerTCO2eNPV")
            .addSelect("project.totalCost", "totalCost")
            .addSelect("project.costPerTCO2e", "costPerTCO2e")
            .addSelect("project.priceType", "priceType")
            .addSelect(
              "project.initialPriceAssumption",
              "initialPriceAssumption"
            );

          if (records?.length) {
            queryBuilder.andWhere("project.id IN (:...ids)", {
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

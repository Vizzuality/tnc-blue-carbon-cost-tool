import "reflect-metadata";
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import { dataSource } from "./datasource.js";
import { AuthProvider } from "./providers/auth.provider.js";
import { UserResource } from "./resources/users/user.resource.js";
import { ProjectSizeResource } from "./resources/project-size/project-size.resource.js";
import { Country } from "@shared/entities/country.entity.js";
import { FeasibilityAnalysisResource } from "./resources/feasability-analysis/feasability-analysis.resource.js";
import { ConservationAndPlanningAdminResource } from "./resources/conservation-and-planning-admin/conservation-and-planning-admin.resource.js";
import { CommunityRepresentationResource } from "./resources/community-representation/community-representation.resource.js";
import { CarbonRightsResource } from "./resources/carbon-righs/carbon-rights.resource.js";
import { FinancingCostResource } from "./resources/financing-cost/financing-cost.resource.js";
import { ValidationCostResource } from "./resources/validation-cost/validation-cost.resource.js";
import { ImplementationLaborCostResource } from "./resources/implementation-labor/implementation-labor-cost.resource.js";
import { MonitoringCostResource } from "./resources/monitoring-cost/monitoring-cost.resource.js";

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 1000;
export const API_URL = process.env.API_URL || "http://localhost:4000";

const componentLoader = new ComponentLoader();
const authProvider = new AuthProvider();

const start = async () => {
  await dataSource.initialize();
  const app = express();

  const databaseNavigation = {
    name: "Data Management",
    icon: "Database",
  };

  const admin = new AdminJS({
    rootPath: "/admin",
    componentLoader,
    resources: [
      UserResource,
      ProjectSizeResource,
      FeasibilityAnalysisResource,
      ConservationAndPlanningAdminResource,
      CommunityRepresentationResource,
      CarbonRightsResource,
      FinancingCostResource,
      ValidationCostResource,
      ImplementationLaborCostResource,
      MonitoringCostResource,
      {
        resource: Country,
        name: "Country",
        options: {
          parent: databaseNavigation,
          icon: "Globe",
        },
      },
    ],
    locale: {
      language: "en",
      translations: {
        en: {
          labels: {
            User: "Users",
            Country: "Countries",
          },
        },
      },
    },
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    provider: authProvider,
    cookiePassword: "some-secret",
  });

  const router = AdminJSExpress.buildRouter(admin);

  app.use(admin.options.rootPath, router);

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`,
    );
  });
};

void start();

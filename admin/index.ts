import "reflect-metadata";
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { dataSource } from "./datasource.js";
import { CarbonInputEntity } from "@api/modules/model/entities/carbon-input.entity.js";
import { CostInput } from "@api/modules/model/entities/cost-input.entity.js";
import { Country } from "@api/modules/model/entities/country.entity.js";
import { AuthProvider } from "./providers/auth.provider.js";
import { userResource } from "./resources/users/user.resource.js";

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 1000;

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
      userResource,
      {
        resource: CostInput,
        name: "Cost Input",
        options: {
          parent: databaseNavigation,
          icon: "Coins",
        },
      },
      {
        resource: Country,
        name: "Country",
        options: {
          parent: databaseNavigation,
          icon: "Globe",
        },
      },
      // {
      //   resource: User,
      //   options: {
      //     parent: databaseNavigation,
      //     icon: "User",
      //   },
      // },
      {
        resource: CarbonInputEntity,
        name: "Andresito",
        options: {
          parent: databaseNavigation,
          icon: "Cloud",
        },
      },
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    provider: authProvider,
    cookiePassword: "some-secret",
  });

  const adminRouterWithAuth = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`,
    );
  });
};

void start();

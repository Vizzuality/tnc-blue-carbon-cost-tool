import "reflect-metadata";
import AdminJS, { ComponentLoader, locales } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { dataSource } from "./datasource.js";
import { CarbonInputEntity } from "@api/modules/model/entities/carbon-input.entity.js";
import { CostInput } from "@api/modules/model/entities/cost-input.entity.js";

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 1000;

const componentLoader = new ComponentLoader();

const start = async () => {
  await dataSource.initialize();
  const app = express();

  const databaseNavigation = {
    name: "Data Management",
    icon: "Database",
  };

  const admin = new AdminJS({
    rootPath: "/administration",
    componentLoader,
    resources: [
      {
        resource: CostInput,
        name: "Cost Input",
        options: {
          parent: databaseNavigation,
          icon: "Coins",
        },
      },
      {
        resource: User,
        options: {
          parent: databaseNavigation,
          icon: "User",
        },
      },
      {
        resource: CarbonInputEntity,
        options: {
          parent: databaseNavigation,
          icon: "Cloud",
        },
      },
    ],
  });

  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`,
    );
  });
};

void start();

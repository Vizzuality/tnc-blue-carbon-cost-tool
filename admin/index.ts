import "reflect-metadata";
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import { User } from "@shared/entities/users/user.entity.js";
import { dataSource } from "./datasource.js";
import { Country } from "@api/modules/model/entities/country.entity.js";
import { CarbonInputEntity } from "@api/modules/model/entities/carbon-input.entity.js";
import { CostInput } from "@api/modules/model/entities/cost-input.entity.js";

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 3000;

const componentLoader = new ComponentLoader();

const start = async () => {
  await dataSource.initialize();
  const app = express();

  const admin = new AdminJS({
    rootPath: "/administration",
    componentLoader,
    resources: [
      { resource: CostInput, options: { navigation: { name: "Cost Inputs" } } },
      { resource: User, navigation: { name: "Users" } },
      { resource: Country, navigation: { name: "Countries" } },
      { resource: CarbonInputEntity, navigation: { name: "Carbon Inputs" } },
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

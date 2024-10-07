import "reflect-metadata";
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 3000;

const componentLoader = new ComponentLoader();

const start = async () => {
  const app = express();

  const admin = new AdminJS({
    rootPath: "/administration",
    componentLoader,
    // resources: [{ resource: User }],
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

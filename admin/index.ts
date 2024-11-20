import "reflect-metadata";
import AdminJS, { ComponentLoader } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import * as AdminJSTypeorm from "@adminjs/typeorm";
import { dataSource } from "./datasource.js";
import { AuthProvider } from "./providers/auth.provider.js";
import { UserResource } from "./resources/users/user.resource.js";
import { Country } from "@shared/entities/country.entity.js";
import { FeasibilityAnalysisResource } from "./resources/feasability-analysis/feasability-analysis.resource.js";
import { ConservationAndPlanningAdminResource } from "./resources/conservation-and-planning-admin/conservation-and-planning-admin.resource.js";
import { CommunityRepresentationResource } from "./resources/community-representation/community-representation.resource.js";
import { CarbonRightsResource } from "./resources/carbon-righs/carbon-rights.resource.js";
import { FinancingCostResource } from "./resources/financing-cost/financing-cost.resource.js";
import { ValidationCostResource } from "./resources/validation-cost/validation-cost.resource.js";
import { MonitoringCostResource } from "./resources/monitoring-cost/monitoring-cost.resource.js";
import { MaintenanceResource } from "./resources/maintenance/maintenance.resource.js";
import { DataCollectionAndFieldCostResource } from "./resources/data-collection-and-field-cost/data-collection-and-field-cost.resource.js";
import { CommunityBenefitResource } from "./resources/community-benefit/community-benefit.resource.js";
import { CarbonStandardFeesResource } from "./resources/carbon-estandard-fees/carbon-estandard-fees.resource.js";
import { CommunityCashFlowResource } from "./resources/community-cash-flow/community-cash-flow.resource.js";
import { EcosystemLossResource } from "./resources/ecosystem-loss/ecosystem-loss.resource.js";
import { RestorableLandResource } from "./resources/restorable-land/restorable-land.resource.js";
import { EmissionFactorsResource } from "./resources/emission-factors/emission-factors.resource.js";
import { BaselineReassessmentResource } from "./resources/baseline-reassesment/baseline-reassesment.resource.js";
import { MRVResource } from "./resources/mrv/mrv.resource.js";
import { BlueCarbonProjectPlanningResource } from "./resources/blue-carbon-project-planning/blue-carbon-project-planning.resource.js";
import { LongTermProjectOperatingResource } from "./resources/long-term-project-operating/long-term-project-operating.resource.js";
import { SequestrationRateResource } from "./resources/sequestration-rate/sequestration-rate.resource.js";
import { ProjectsResource } from "./resources/projects/projects.resource.js";
import { ProjectSizeResource } from "./resources/project-size/project-size.resource.js";
import { ImplementationLaborCostResource } from "./resources/implementation-labor-cost/implementation-labor-cost.resource.js";
import { BaseSizeResource } from "./resources/base-size/base-size.resource.js";
import { BaseIncreaseResource } from "./resources/base-increase/base-increase.resource.js";
import { ModelAssumptionResource } from "./resources/model-assumptions/model-assumptions.resource.js";
import { UserUploadedData } from "@shared/entities/user-project-data.entity.js";

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
      MonitoringCostResource,
      MaintenanceResource,
      DataCollectionAndFieldCostResource,
      CommunityBenefitResource,
      CarbonStandardFeesResource,
      CommunityCashFlowResource,
      EcosystemLossResource,
      RestorableLandResource,
      EmissionFactorsResource,
      BaselineReassessmentResource,
      MRVResource,
      BlueCarbonProjectPlanningResource,
      LongTermProjectOperatingResource,
      SequestrationRateResource,
      ProjectsResource,
      ImplementationLaborCostResource,
      BaseSizeResource,
      BaseIncreaseResource,
      ModelAssumptionResource,
      {
        resource: Country,
        name: "Country",
        options: {
          id: "Countries",
          parent: databaseNavigation,
          icon: "Globe",
        },
      },
    ],
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

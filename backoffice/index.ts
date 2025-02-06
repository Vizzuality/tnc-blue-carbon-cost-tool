import 'reflect-metadata';
import AdminJS, { BaseAuthProvider, ComponentLoader } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express, { Request, Response } from 'express';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { dataSource } from './datasource.js';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { AuthProvider } from './providers/auth.provider.js';
import { UserResource } from './resources/users/user.resource.js';
import { FeasibilityAnalysisResource } from './resources/feasability-analysis/feasability-analysis.resource.js';
import { ConservationAndPlanningAdminResource } from './resources/conservation-and-planning-admin/conservation-and-planning-admin.resource.js';
import { CommunityRepresentationResource } from './resources/community-representation/community-representation.resource.js';
import { CarbonRightsResource } from './resources/carbon-righs/carbon-rights.resource.js';
import { FinancingCostResource } from './resources/financing-cost/financing-cost.resource.js';
import { ValidationCostResource } from './resources/validation-cost/validation-cost.resource.js';
import { MonitoringCostResource } from './resources/monitoring-cost/monitoring-cost.resource.js';
import { MaintenanceResource } from './resources/maintenance/maintenance.resource.js';
import { DataCollectionAndFieldCostResource } from './resources/data-collection-and-field-cost/data-collection-and-field-cost.resource.js';
import { CommunityBenefitResource } from './resources/community-benefit/community-benefit.resource.js';
import { CarbonStandardFeesResource } from './resources/carbon-estandard-fees/carbon-estandard-fees.resource.js';
import { CommunityCashFlowResource } from './resources/community-cash-flow/community-cash-flow.resource.js';
import { EcosystemLossResource } from './resources/ecosystem-loss/ecosystem-loss.resource.js';
import { RestorableLandResource } from './resources/restorable-land/restorable-land.resource.js';
import { EmissionFactorsResource } from './resources/emission-factors/emission-factors.resource.js';
import { BaselineReassessmentResource } from './resources/baseline-reassesment/baseline-reassesment.resource.js';
import { MRVResource } from './resources/mrv/mrv.resource.js';
import { BlueCarbonProjectPlanningResource } from './resources/blue-carbon-project-planning/blue-carbon-project-planning.resource.js';
import { LongTermProjectOperatingResource } from './resources/long-term-project-operating/long-term-project-operating.resource.js';
import { SequestrationRateResource } from './resources/sequestration-rate/sequestration-rate.resource.js';
import { ProjectsResource } from './resources/projects/projects.resource.js';
import { ProjectSizeResource } from './resources/project-size/project-size.resource.js';
import { ImplementationLaborCostResource } from './resources/implementation-labor-cost/implementation-labor-cost.resource.js';
import { BaseSizeResource } from './resources/base-size/base-size.resource.js';
import { BaseIncreaseResource } from './resources/base-increase/base-increase.resource.js';
import { ModelAssumptionResource } from './resources/model-assumptions/model-assumptions.resource.js';
import { UserUploadCostInputs } from '@shared/entities/users/user-upload-cost-inputs.entity.js';
import { UserUploadConservationInputs } from '@shared/entities/users/user-upload-conservation-inputs.entity.js';
import { UserUploadRestorationInputs } from '@shared/entities/users/user-upload-restoration-inputs.entity.js';
import { GLOBAL_COMMON_PROPERTIES } from './resources/common/common.resources.js';
import { BACKOFFICE_SESSIONS_TABLE } from '@shared/entities/users/backoffice-session.js';
import { CountryResource } from './resources/countries/country.resource.js';
import { componentLoader, Components } from 'backoffice/components/index.js';
import { ModelComponentSourceResource } from 'backoffice/resources/model-component-source/model-component-source.resource.js';
import { EcosystemExtentResource } from 'backoffice/resources/ecosystem-extent/ecosystem-extent.resource.js';

AdminJS.registerAdapter({
  Database: AdminJSTypeorm.Database,
  Resource: AdminJSTypeorm.Resource,
});

const PORT = 1000;
export const API_URL = process.env.API_URL || 'http://localhost:4000';
const authProvider = new AuthProvider();

const start = async () => {
  const PgStore = connectPgSimple(session);
  const sessionStore = new PgStore({
    pool: new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'blue-carbon-cost',
      password: process.env.DB_PASSWORD || 'blue-carbon-cost',
      database: process.env.DB_NAME || 'blc-dev',
      port: 5432,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    tableName: BACKOFFICE_SESSIONS_TABLE,
  });
  await dataSource.initialize();
  const app = express();

  const databaseNavigation = {
    name: 'Data Management',
    icon: 'Database',
  };

  const admin = new AdminJS({
    branding: {
      companyName: 'Blue Carbon Cost',
      withMadeWithLove: false,
      logo: false,
    },
    dashboard: {
      component: Components.Dashboard,
    },
    rootPath: '/admin',
    componentLoader,
    resources: [
      UserResource,
      {
        resource: UserUploadCostInputs,
        name: 'UserUploadCostInputs',
        options: {
          navigation: {
            name: 'User Data',
            icon: 'File',
          },
          properties: {
            ...GLOBAL_COMMON_PROPERTIES,
          },
        },
      },
      {
        resource: UserUploadConservationInputs,
        name: 'UserUploadConservationInputs',
        options: {
          navigation: {
            name: 'User Data',
            icon: 'File',
          },
          properties: {
            ...GLOBAL_COMMON_PROPERTIES,
          },
        },
      },
      {
        resource: UserUploadRestorationInputs,
        name: 'UserUploadRestorationInputs',
        options: {
          navigation: {
            name: 'User Data',
            icon: 'File',
          },
          properties: {
            ...GLOBAL_COMMON_PROPERTIES,
          },
        },
      },
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
      CountryResource,
      ModelComponentSourceResource,
      EcosystemExtentResource,
    ],
    pages: {
      'data-upload': {
        icon: 'File',
        component: Components.FileIngestion,
        handler: async (request: Request, response: Response) => {
          // Pass config
          response.json({
            config: {
              apiUrl: API_URL,
            },
          });
        },
      },
    },
    locale: {
      debug: false,
      language: 'en',
      translations: {
        en: {
          labels: {
            User: 'Users',
            Country: 'Countries',
            Project: 'Projects',
            ProjectSize: 'Project Sizes',
            // Note: This is the title of the pages section in the sidebar.
            // see full example here: https://github.com/SoftwareBrothers/adminjs/blob/master/src/locale/en/translation.json
            pages: 'Uploads',
          },
          resources: {
            ProjectSize: {
              properties: {
                countryCode: 'Country',
              },
            },
          },
        },
      },
    },
  });

  const customRouter = express.Router();
  // Redirect to the app's login page
  customRouter.get('/login', (req, res) => {
    res.redirect('/auth/signin');
  });

  const sessionCookieName = process.env
    .BACKOFFICE_SESSION_COOKIE_NAME as string;
  const sessionCookieSecret = process.env
    .BACKOFFICE_SESSION_COOKIE_SECRET as string;
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      provider: authProvider as BaseAuthProvider<unknown>,
      cookieName: sessionCookieName,
      cookiePassword: sessionCookieSecret,
    },
    customRouter,
    {
      store: sessionStore,
      secret: sessionCookieSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: false,
        maxAge: undefined,
      },
    },
  );

  app.use(admin.options.rootPath, adminRouter);
  admin.watch();
  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`,
    );
  });
};

void start();

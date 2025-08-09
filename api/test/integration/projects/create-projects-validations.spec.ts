import { projectsContract } from '@shared/contracts/projects.contract';
import { CreateProjectDto } from '@shared/dtos/projects/create-project.dto';
import {
  ACTIVITY,
  RESTORATION_ACTIVITY_SUBTYPE,
} from '@shared/entities/activity.enum';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { SEQUESTRATION_RATE_TIER_TYPES } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { Project } from '@shared/entities/projects.entity';
import { TestManager } from '../../utils/test-manager';
import { TestUser } from '../../utils/user.auth';

describe('Create projects Validations', () => {
  let testManager: TestManager;
  let user: TestUser;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    user = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(user.jwtToken);
    await testManager.ingestExcel(user.jwtToken);
  });

  afterEach(async () => {
    await testManager.getDataSource().getRepository(Project).delete({});
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Conservation project', () => {
    test('should fail if lossRateUsed is PROJECT_SPECIFIC and projectSpecificLossRate is missing', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Conservation X',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 100,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 40,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Project Specific Loss Rate is required when loss rate used is Project Specific',
      );
    });

    test('should fail if loss rate used is national average, but project specific loss rate is provided', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Conservation Y',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 100,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 40,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
          projectSpecificLossRate: -0.12,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'projectSpecificLossRate should not be provided unless lossRateUsed is Project Specific',
      );
    });

    test('should fail if emission factor used is tier 2 but no emission factors AGB and SOC are provided', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Conservation Y',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 100,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 40,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_2,
          projectSpecificEmission:
            PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Emission Factor AGB and SOC are required when emissionFactorUsed is Tier 2',
      );
    });

    test('should fail if Tier 2 is used and ecosystem is neither MANGROVE nor SALT MARSH', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Wrong Tier 2 Ecosystem',
        ecosystem: ECOSYSTEM.SEAGRASS,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 50,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 30,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.NATIONAL_AVERAGE,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_2,
          emissionFactorAGB: 10,
          emissionFactorSOC: 5,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'There is only Tier 2 emission factor for Mangrove and Salt Marsh ecosystems',
      );
    });

    test('should fail if Tier 3 + ONE emission and missing emission factor', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Missing One Emission Factor',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 100,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 50,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          projectSpecificLossRate: -0.1,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_3,
          projectSpecificEmission:
            PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
          // Missing projectSpecificEmissionFactor
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Project Specific Emission Factor must be provided when emissionFactorUsed is Tier 3 and projectSpecificEmission is One emission factor',
      );
    });

    test('should fail if Tier 3 + TWO emissions and missing AGB or SOC', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Missing AGB or SOC',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 100,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 50,
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          projectSpecificLossRate: -0.1,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_3,
          projectSpecificEmission:
            PROJECT_SPECIFIC_EMISSION.TWO_EMISSION_FACTORS,
          emissionFactorAGB: 10,
          // Missing emissionFactorSOC
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Emission Factor SOC is required when emissionFactorUsed is Tier 3 and projectSpecificEmission is Two emission factors',
      );
    });
  });

  describe('Restoration project', () => {
    test('should fail if restorationActivity is not provided', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Restoration project',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.RESTORATION,
        projectSizeHa: 100,
        initialCarbonPriceAssumption: 20,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        parameters: {
          tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Restoration Activity is required for Restoration Projects',
      );
    });
    test('should fail if Restoration uses TIER_3 and projectSpecificSequestrationRate is missing', async () => {
      const body: CreateProjectDto = {
        countryCode: 'USA',
        projectName: 'Missing Sequestration Rate',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.RESTORATION,
        projectSizeHa: 100,
        initialCarbonPriceAssumption: 50,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        parameters: {
          restorationActivity: RESTORATION_ACTIVITY_SUBTYPE.PLANTING,
          tierSelector: SEQUESTRATION_RATE_TIER_TYPES.TIER_3,
          // Missing projectSpecificSequestrationRate
        },
      };

      const res = await testManager
        .request()
        .post(projectsContract.createProject.path)
        .set('Cookie', user.backofficeSessionCookie)
        .send(body);

      expect(res.status).toBe(400);
      expect(res.body.errors[0].title).toEqual(
        'Project Specific Rate is required for Tier 3 Sequestration rate',
      );
    });
  });
});

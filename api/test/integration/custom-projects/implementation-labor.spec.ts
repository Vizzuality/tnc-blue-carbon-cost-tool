import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';
import {
  CARBON_REVENUES_TO_COVER,
  CustomProject,
  PROJECT_SPECIFIC_EMISSION,
} from '@shared/entities/custom-project.entity';
import { LOSS_RATE_USED } from '@shared/schemas/custom-projects/create-custom-project.schema';
import { EMISSION_FACTORS_TIER_TYPES } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { User } from '@shared/entities/users/user.entity';

/**
 * @todo: This is a temporal workaround to set the implementation labor to 0 for conservation projects. Ideally we should fix this
 *        by not using implementation labor for conservation projects, both in the model and handling it properly in the frontend.
 *        Due to time constraints, we have decided to set it to 0 for now no matter if its a brand new project or a update.
 *        This way it does not build up to other costs. This leaves a edge case bug that is tracked
 */

describe('Implementation Labor - Set to 0 for Conservation type of Projects', () => {
  let testManager: TestManager;
  let customProjectsService: CustomProjectsService;
  let customProjectServiceSpy: jest.SpyInstance;
  let token: string;
  let user: User;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    await testManager.ingestCountries();
    customProjectsService =
      testManager.moduleFixture.get<CustomProjectsService>(
        CustomProjectsService,
      );
    customProjectServiceSpy = jest
      .spyOn(customProjectsService, 'create')
      .mockResolvedValue({} as any);
    const { jwtToken, user: testUser } = await testManager.setUpTestUser();
    token = jwtToken;
    user = testUser;
  });

  beforeEach(() => {
    // This is required for the mock instance to not accumulate calls during the run so that each test has a clean slate for the spy
    customProjectServiceSpy.mockClear();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Create Custom Project', () => {
    test('should not override implementation labor if project type is restoration', async () => {
      const sampleDto = {
        countryCode: 'MEX',
        projectName: 'Restoration Mexico Mangrove',
        ecosystem: 'Mangrove',
        activity: 'Restoration',
        projectSizeHa: 500,
        carbonRevenuesToCover: 'Capex and Opex',
        initialCarbonPriceAssumption: 30,
        assumptions: {
          verificationFrequency: 5,
          baselineReassessmentFrequency: 10,
          discountRate: 0.04,
          restorationRate: 250,
          carbonPriceIncrease: 0.015,
          buffer: 0.2,
          projectLength: 20,
        },
        costInputs: {
          feasibilityAnalysis: 50000,
          conservationPlanningAndAdmin: 166766.666666667,
          dataCollectionAndFieldCost: 26666.6666666667,
          communityRepresentation: 72600,
          blueCarbonProjectPlanning: 100000,
          establishingCarbonRights: 46666.6666666667,
          validation: 50000,
          implementationLabor: 15986,
          monitoring: 11900,
          maintenance: 0.0833,
          communityBenefitSharingFund: 0.5,
          carbonStandardFees: 0.2,
          baselineReassessment: 40000,
          mrv: 75000,
          longTermProjectOperatingCost: 31300,
          financingCost: 0.05,
        },
        parameters: {
          restorationActivity: 'Planting',
          tierSelector: 'Tier 2 - Country-specific rate',
          plantingSuccessRate: 0.008,
        },
      };

      await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(sampleDto);

      expect(customProjectServiceSpy).toHaveBeenCalled();

      const dtoReceived = customProjectServiceSpy.mock.calls[0][0];

      expect(dtoReceived).toHaveProperty(
        'costInputs.implementationLabor',
        sampleDto.costInputs.implementationLabor,
      );
    });

    test('should set implementation labor to 0 if project type is conservation', async () => {
      const sampleDto = {
        countryCode: 'IDN',
        projectName: 'Conservation_Mangrove_Indonesia',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 10000,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 20,
        assumptions: {
          verificationFrequency: 5,
          baselineReassessmentFrequency: 10,
          discountRate: 0.04,
          carbonPriceIncrease: 0.015,
          buffer: 0.2,
          projectLength: 20,
        },
        costInputs: {
          feasibilityAnalysis: 50000,
          conservationPlanningAndAdmin: 166766.666666667,
          dataCollectionAndFieldCost: 26666.6666666667,
          communityRepresentation: 71183.3333333333,
          blueCarbonProjectPlanning: 100000,
          establishingCarbonRights: 46666.6666666667,
          validation: 50000,
          implementationLabor: 1234,
          monitoring: 15000,
          maintenance: 0.0833,
          communityBenefitSharingFund: 0.5,
          carbonStandardFees: 0.2,
          baselineReassessment: 40000,
          mrv: 75000,
          longTermProjectOperatingCost: 26400,
          financingCost: 0.05,
        },
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_2,
          projectSpecificEmission:
            PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
          projectSpecificLossRate: -0.001,
          projectSpecificEmissionFactor: 15,
          emissionFactorAGB: 200,
          emissionFactorSOC: 15,
        },
      };
      await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(sampleDto);

      expect(customProjectServiceSpy).toHaveBeenCalled();

      const dtoReceived = customProjectServiceSpy.mock.calls[0][0];

      expect(dtoReceived).toHaveProperty('costInputs.implementationLabor', 0);
    });
  });
  describe('Update Custom Project', () => {
    let customProject: CustomProject;
    beforeAll(async () => {
      customProject = await testManager.mocks().createCustomProject({ user });
    });

    test('should not override implementation labor if project type is restoration', async () => {
      const sampleDto = {
        countryCode: 'MEX',
        projectName: 'Restoration Mexico Mangrove',
        ecosystem: 'Mangrove',
        activity: 'Restoration',
        projectSizeHa: 500,
        carbonRevenuesToCover: 'Capex and Opex',
        initialCarbonPriceAssumption: 30,
        assumptions: {
          verificationFrequency: 5,
          baselineReassessmentFrequency: 10,
          discountRate: 0.04,
          restorationRate: 250,
          carbonPriceIncrease: 0.015,
          buffer: 0.2,
          projectLength: 20,
        },
        costInputs: {
          feasibilityAnalysis: 50000,
          conservationPlanningAndAdmin: 166766.666666667,
          dataCollectionAndFieldCost: 26666.6666666667,
          communityRepresentation: 72600,
          blueCarbonProjectPlanning: 100000,
          establishingCarbonRights: 46666.6666666667,
          validation: 50000,
          implementationLabor: 15986,
          monitoring: 11900,
          maintenance: 0.0833,
          communityBenefitSharingFund: 0.5,
          carbonStandardFees: 0.2,
          baselineReassessment: 40000,
          mrv: 75000,
          longTermProjectOperatingCost: 31300,
          financingCost: 0.05,
        },
        parameters: {
          restorationActivity: 'Planting',
          tierSelector: 'Tier 2 - Country-specific rate',
          plantingSuccessRate: 0.008,
        },
      };

      await testManager
        .request()
        .patch(
          customProjectContract.updateCustomProject.path.replace(
            ':id',
            customProject.id,
          ),
        )
        .send(sampleDto)
        .set('Authorization', `Bearer ${token}`);

      expect(customProjectServiceSpy).toHaveBeenCalled();

      const dtoReceived = customProjectServiceSpy.mock.calls[0][0];

      expect(dtoReceived).toHaveProperty(
        'costInputs.implementationLabor',
        sampleDto.costInputs.implementationLabor,
      );
    });
    test('should set implementation labor to 0 if project type is conservation', async () => {
      const customProject = await testManager
        .mocks()
        .createCustomProject({ user });
      const sampleDto = {
        countryCode: 'IDN',
        projectName: 'Conservation_Mangrove_Indonesia',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
        projectSizeHa: 10000,
        carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
        initialCarbonPriceAssumption: 20,
        assumptions: {
          verificationFrequency: 5,
          baselineReassessmentFrequency: 10,
          discountRate: 0.04,
          carbonPriceIncrease: 0.015,
          buffer: 0.2,
          projectLength: 20,
        },
        costInputs: {
          feasibilityAnalysis: 50000,
          conservationPlanningAndAdmin: 166766.666666667,
          dataCollectionAndFieldCost: 26666.6666666667,
          communityRepresentation: 71183.3333333333,
          blueCarbonProjectPlanning: 100000,
          establishingCarbonRights: 46666.6666666667,
          validation: 50000,
          implementationLabor: 1234,
          monitoring: 15000,
          maintenance: 0.0833,
          communityBenefitSharingFund: 0.5,
          carbonStandardFees: 0.2,
          baselineReassessment: 40000,
          mrv: 75000,
          longTermProjectOperatingCost: 26400,
          financingCost: 0.05,
        },
        parameters: {
          lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
          emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_2,
          projectSpecificEmission:
            PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
          projectSpecificLossRate: -0.001,
          projectSpecificEmissionFactor: 15,
          emissionFactorAGB: 200,
          emissionFactorSOC: 15,
        },
      };
      await testManager
        .request()
        .patch(
          customProjectContract.updateCustomProject.path.replace(
            ':id',
            customProject.id,
          ),
        )
        .send(sampleDto)
        .set('Authorization', `Bearer ${token}`);

      expect(customProjectServiceSpy).toHaveBeenCalled();

      const dtoReceived = customProjectServiceSpy.mock.calls[0][0];
      expect(dtoReceived).toHaveProperty('costInputs.implementationLabor', 0);
    });
  });
});

import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { ECOSYSTEM } from '@shared/entities/ecosystem.enum';
import { ACTIVITY } from '@shared/entities/activity.enum';

describe('Create Custom Projects - Setup', () => {
  let testManager: TestManager;
  let jwtToken: string;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken: token } = await testManager.setUpTestUser();
    jwtToken = token;
    await testManager.ingestCountries();
    await testManager.ingestExcel(jwtToken);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Should return the list of countries that are available to create a custom project', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getAvailableCountries.path);

    expect(response.body.data).toHaveLength(9);
  });
  test('Should return default model assumptions', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getDefaultAssumptions.path);

    expect(Object.keys(response.body.data)).toHaveLength(21);
  });

  test('Should return default cost inputs given required filters', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getDefaultCostInputs.path)
      .query({
        countryCode: 'IND',
        ecosystem: ECOSYSTEM.MANGROVE,
        activity: ACTIVITY.CONSERVATION,
      });

    expect(response.body.data).toMatchObject({
      feasibilityAnalysis: 50000,
      conservationPlanningAndAdmin: 166766.66666666666,
      dataCollectionAndFieldCost: 26666.666666666668,
      communityRepresentation: 67633.33333333333,
      blueCarbonProjectPlanning: 100000,
      establishingCarbonRights: 46666.666666666664,
      financingCost: 0.05,
      validation: 50000,
      implementationLaborHybrid: null,
      monitoring: 8400,
      maintenance: 0.0833,
      carbonStandardFees: 0.2,
      communityBenefitSharingFund: 0.5,
      baselineReassessment: 40000,
      mrv: 75000,
      longTermProjectOperatingCost: 22200,
    });
  });
});

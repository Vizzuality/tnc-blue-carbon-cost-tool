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

  describe('Get Overridable Model Assumptions', () => {
    test('Should return overridable model assumptions based on ecosystem and activity', async () => {
      const response = await testManager
        .request()
        .get(customProjectContract.getDefaultAssumptions.path)
        .query({
          ecosystem: ECOSYSTEM.MANGROVE,
          activity: ACTIVITY.CONSERVATION,
        });

      expect(response.body.data).toHaveLength(7);
      expect(response.body.data.map((assumptions) => assumptions.name)).toEqual(
        [
          'Baseline reassessment frequency',
          'Buffer',
          'Carbon price increase',
          'Conservation project length',
          'Discount rate',
          'Mangrove restoration rate',
          'Verification frequency',
        ],
      );
    });
  });

  test('Should return the list of countries that are available to create a custom project', async () => {
    const response = await testManager
      .request()
      .get(customProjectContract.getAvailableCountries.path);

    expect(response.body.data).toHaveLength(9);
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
      conservationPlanningAndAdmin: 166766.666666667,
      dataCollectionAndFieldCost: 26666.6666666667,
      communityRepresentation: 67633.3333333333,
      blueCarbonProjectPlanning: 100000,
      establishingCarbonRights: 46666.6666666667,
      financingCost: 0.05,
      validation: 50000,
      implementationLabor: 0,
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

import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { RESTORATION_MEXICO_MANGROVE_FIXTURES } from './fixtures/restoration-mexico-mangroves';
import { CustomProject } from '@shared/entities/custom-project.entity';
import '../../custom-matchers';

describe('Calculations Restoration', () => {
  let testManager: TestManager;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  // Utility test
  test.skip('Should compute the restoration costs for a given custom restoration project', async () => {
    const response = await testManager
      .request()
      .post(customProjectContract.createCustomProject.path)
      .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

    const customProjectOutput: CustomProject['output'] =
      response.body.data.output;
    const {
      initialCarbonPriceComputationOutput,
      breakevenPriceComputationOutput,
    } = customProjectOutput;

    expect(initialCarbonPriceComputationOutput.yearlyBreakdown).toEqual(
      RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
        .initialCarbonPriceComputationOutput.yearlyBreakdown,
    );
  });

  // Below tests are temporal so that we can progress fixing the calculations step by step

  describe('Yearly breakdown of costs', () => {
    test('Maintenance, baseline reassesment frecuency, implementation labor ', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const maintenance = yearlyBreakdown.find(
        (y) => y.costName === 'maintenance',
      );

      const baselineReassesmentFrecuency = yearlyBreakdown.find(
        (y) => y.costName === 'baselineReassessment',
      );
      const implementationLabor = yearlyBreakdown.find(
        (y) => y.costName === 'implementationLabor',
      );

      const expectedMaintenance =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'maintenance',
        );
      const expectedBaselineReassesmentFrecuency =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'baselineReassessment',
        );
      const expectedImplementationLabor =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'implementationLabor',
        );

      expect(maintenance).toBeCloseToObject(expectedMaintenance);
      expect(baselineReassesmentFrecuency).toBeCloseToObject(
        expectedBaselineReassesmentFrecuency,
      );
      expect(implementationLabor).toBeCloseToObject(
        expectedImplementationLabor,
      );
    });
    test('blue carbon planning costs', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const blueCarbonPlanning = yearlyBreakdown.find(
        (y) => y.costName === 'blueCarbonProjectPlanning',
      );

      const expectedBlueCarbonPlanning =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'blueCarbonProjectPlanning',
        );

      expect(blueCarbonPlanning).toBeCloseToObject(expectedBlueCarbonPlanning);
    });
    test('community representation costs', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const communityRepresentation = yearlyBreakdown.find(
        (y) => y.costName === 'communityRepresentation',
      );

      const expectedCommunityRepresentation =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'communityRepresentation',
        );

      expect(communityRepresentation).toBeCloseToObject(
        expectedCommunityRepresentation,
      );
    });
    test('community benefit and sharing costs, estimated revenue costs, credits issued plan', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const communityBenefitSharing = yearlyBreakdown.find(
        (y) => y.costName === 'communityBenefitSharingFund',
      );

      const estimatedRevenue = yearlyBreakdown.find(
        (y) => y.costName === 'estimatedRevenuePlan',
      );

      const creditsIssuedPlan = yearlyBreakdown.find(
        (y) => y.costName === 'creditsIssuedPlan',
      );

      const expectedEstimatedRevenue =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'estimatedRevenuePlan',
        );

      const expectedCreditsIssuedPlan =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'creditsIssuedPlan',
        );

      const expectedCommunityBenefitSharing =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'communityBenefitSharingFund',
        );

      expect(communityBenefitSharing).toBeCloseToObject(
        expectedCommunityBenefitSharing,
        500,
      );
      expect(estimatedRevenue).toBeCloseToObject(expectedEstimatedRevenue, 800);

      // TODO: DOUBLE CHECK IF EXPECTED TOTAL NPV IS CORRECT
      expect(creditsIssuedPlan).toBeCloseToObject(expectedCreditsIssuedPlan);
    });
  });
});

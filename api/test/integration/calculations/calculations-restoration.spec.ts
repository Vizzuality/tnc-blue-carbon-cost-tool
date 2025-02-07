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
  test('All yearly breakdown costplans', async () => {
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

    const { yearlyBreakdown } = initialCarbonPriceComputationOutput;

    const expectedYearlyBreakdown =
      RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
        .initialCarbonPriceComputationOutput.yearlyBreakdown;

    expect(yearlyBreakdown).toBeCloseToCustomProjectOutput(
      expectedYearlyBreakdown,
      735,
    );
  });

  describe('Project cost', () => {
    test('TotalProjectCost', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const { totalProjectCost } =
        customProjectOutput.initialCarbonPriceComputationOutput;

      const expectedTotalProjectCost =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
          .initialCarbonPriceComputationOutput.totalProjectCost;

      expect(totalProjectCost).toBeCloseToCustomProjectOutput(
        expectedTotalProjectCost,
        400,
      );
    });
    test.skip('Leftover', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const { leftover } =
        customProjectOutput.initialCarbonPriceComputationOutput;

      const expectedLeftover =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
          .initialCarbonPriceComputationOutput.leftover;

      expect(leftover).toBeCloseToCustomProjectOutput(expectedLeftover, 400);
    });
  });

  describe.skip('Initial carbon price computation', () => {
    test('Initial carbon price computation', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const { initialCarbonPriceComputationOutput } = customProjectOutput;

      delete initialCarbonPriceComputationOutput.summary;
      delete initialCarbonPriceComputationOutput.yearlyBreakdown;
      delete initialCarbonPriceComputationOutput.costDetails;

      const expectedInitialCarbonPriceComputationOutput =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
          .initialCarbonPriceComputationOutput;

      delete expectedInitialCarbonPriceComputationOutput.summary;
      delete expectedInitialCarbonPriceComputationOutput.yearlyBreakdown;
      delete expectedInitialCarbonPriceComputationOutput.costDetails;

      console.log('stop');

      expect(
        initialCarbonPriceComputationOutput,
      ).toBeCloseToCustomProjectOutput(
        expectedInitialCarbonPriceComputationOutput,
        400,
      );
    });
  });

  describe('Project details', () => {
    test('Project details', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const { costDetails } =
        customProjectOutput.initialCarbonPriceComputationOutput;

      const expectedProjectDetails =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
          .initialCarbonPriceComputationOutput.costDetails;

      expect(costDetails).toBeCloseToCustomProjectOutput(
        expectedProjectDetails,
        400,
      );
    });
  });

  describe('Project summary', () => {
    test('Project summary', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const { summary } =
        customProjectOutput.initialCarbonPriceComputationOutput;

      const expectedSummary =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput
          .initialCarbonPriceComputationOutput.summary;

      expect(summary).toBeCloseToCustomProjectOutput(expectedSummary, 750);
    });
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

      expect(maintenance).toBeCloseToCustomProjectOutput(expectedMaintenance);
      expect(baselineReassesmentFrecuency).toBeCloseToCustomProjectOutput(
        expectedBaselineReassesmentFrecuency,
      );
      expect(implementationLabor).toBeCloseToCustomProjectOutput(
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

      expect(blueCarbonPlanning).toBeCloseToCustomProjectOutput(
        expectedBlueCarbonPlanning,
      );
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

      expect(communityRepresentation).toBeCloseToCustomProjectOutput(
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

      expect(communityBenefitSharing).toBeCloseToCustomProjectOutput(
        expectedCommunityBenefitSharing,
        500,
      );
      expect(estimatedRevenue).toBeCloseToCustomProjectOutput(
        expectedEstimatedRevenue,
        800,
      );

      expect(creditsIssuedPlan).toBeCloseToCustomProjectOutput(
        expectedCreditsIssuedPlan,
      );
    });

    test('carbon standard fees, opex total cost plan, total cost plan', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const carbonStandardFees = yearlyBreakdown.find(
        (y) => y.costName === 'carbonStandardFees',
      );

      const opexTotalCostPlan = yearlyBreakdown.find(
        (y) => y.costName === 'opexTotalCostPlan',
      );

      const totalCostPlan = yearlyBreakdown.find(
        (y) => y.costName === 'totalCostPlan',
      );

      const expectedTotalCostPlan =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'totalCostPlan',
        );

      const expectedOpexTotalCostPlan =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'opexTotalCostPlan',
        );

      const expectedCarbonStandardFees =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'carbonStandardFees',
        );

      expect(totalCostPlan).toBeCloseToCustomProjectOutput(
        expectedTotalCostPlan,
        400,
      );
      expect(carbonStandardFees).toBeCloseToCustomProjectOutput(
        expectedCarbonStandardFees,
      );
      expect(opexTotalCostPlan).toBeCloseToCustomProjectOutput(
        expectedOpexTotalCostPlan,
        500,
      );
    });
    test('annual net cash flow, annual net income', async () => {
      const response = await testManager
        .request()
        .post(customProjectContract.createCustomProject.path)
        .send(RESTORATION_MEXICO_MANGROVE_FIXTURES.createDTO);

      const customProjectOutput: CustomProject['output'] =
        response.body.data.output;

      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;

      const annualNetCashFlow = yearlyBreakdown.find(
        (y) => y.costName === 'annualNetCashFlow',
      );

      const expectedAnnualNetCashFlow =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'annualNetCashFlow',
        );

      const annualNetIncome = yearlyBreakdown.find(
        (y) => y.costName === 'annualNetIncome',
      );

      const expectedAnnualNetIncome =
        RESTORATION_MEXICO_MANGROVE_FIXTURES.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'annualNetIncome',
        );

      expect(annualNetCashFlow).toBeCloseToCustomProjectOutput(
        expectedAnnualNetCashFlow,
        400,
      );
      expect(annualNetIncome).toBeCloseToCustomProjectOutput(
        expectedAnnualNetIncome,
        400,
      );
    });
  });
});

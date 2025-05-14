import { TestManager } from '../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProject } from '@shared/entities/custom-project.entity';
import '../../custom-matchers';
import { CONSERVATION_MANGROVE_INDONESIA } from './fixtures/conservation-indonesia-mangrove';
import { ConservationProjectOutput } from '@shared/dtos/custom-projects/custom-project-output.dto';

describe.skip('Calculations Tests Case: - Conservation Mangroves China', () => {
  let testManager: TestManager;
  let customProjectOutput: CustomProject['output'];

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
    const response = await testManager
      .request()
      .post(customProjectContract.createCustomProject.path)
      .send(CONSERVATION_MANGROVE_INDONESIA.createDTO);
    customProjectOutput = response.body.data.output;
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  test('Full Conservation Project Output', async () => {
    expect(customProjectOutput).toBeCloseToCustomProjectOutput(
      CONSERVATION_MANGROVE_INDONESIA.expectedOutput,
      750,
    );
  });

  describe('Project cost', () => {
    test('TotalProjectCost', async () => {
      const { totalProjectCost } =
        customProjectOutput.initialCarbonPriceComputationOutput;
      const expectedTotalProjectCost =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput.totalProjectCost;
      expect(totalProjectCost).toBeCloseToCustomProjectOutput(
        expectedTotalProjectCost,
        400,
      );
    });
    test('Leftover', async () => {
      const { leftover } =
        customProjectOutput.initialCarbonPriceComputationOutput;
      const expectedLeftover =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput.leftover;
      expect(leftover).toBeCloseToCustomProjectOutput(expectedLeftover, 750);
    });
  });

  describe('Project type specific values', () => {
    test('Planting success rate and Sequestration rate', async () => {
      const { initialCarbonPriceComputationOutput } = customProjectOutput;
      const { lossRate, emissionFactors, initialCarbonPrice } =
        initialCarbonPriceComputationOutput as ConservationProjectOutput;
      const expectedOutput =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput;
      expect(lossRate).toEqual(expectedOutput.lossRate);
      expect(emissionFactors).toEqual(expectedOutput.emissionFactors);
      expect(initialCarbonPrice).toEqual(expectedOutput.initialCarbonPrice);
    });
  });

  describe('Project Cost details', () => {
    test('Project Cost details', async () => {
      const { costDetails } =
        customProjectOutput.initialCarbonPriceComputationOutput;
      const expectedProjectDetails =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput.costDetails;
      expect(costDetails).toBeCloseToCustomProjectOutput(
        expectedProjectDetails,
        400,
      );
    });
  });

  describe('Project summary', () => {
    test('Project summary', async () => {
      const { summary } =
        customProjectOutput.initialCarbonPriceComputationOutput;
      const expectedSummary =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput.summary;
      expect(summary).toBeCloseToCustomProjectOutput(expectedSummary, 750);
    });
  });

  describe('Yearly breakdown of costs', () => {
    test('All yearly breakdown costplans', async () => {
      const { initialCarbonPriceComputationOutput } = customProjectOutput;
      const { yearlyBreakdown } = initialCarbonPriceComputationOutput;
      const expectedYearlyBreakdown =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .initialCarbonPriceComputationOutput.yearlyBreakdown;
      expect(yearlyBreakdown).toBeCloseToCustomProjectOutput(
        expectedYearlyBreakdown,
        735,
      );
    });
    test('Maintenance, baseline reassessment frequency, implementation labor', async () => {
      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;
      const maintenance = yearlyBreakdown.find(
        (y) => y.costName === 'maintenance',
      );
      const baselineReassessment = yearlyBreakdown.find(
        (y) => y.costName === 'baselineReassessment',
      );
      const implementationLabor = yearlyBreakdown.find(
        (y) => y.costName === 'implementationLabor',
      );
      const expectedMaintenance =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'maintenance',
        );
      const expectedBaselineReassessment =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'baselineReassessment',
        );
      const expectedImplementationLabor =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'implementationLabor',
        );
      expect(maintenance).toBeCloseToCustomProjectOutput(expectedMaintenance);
      expect(baselineReassessment).toBeCloseToCustomProjectOutput(
        expectedBaselineReassessment,
      );
      expect(implementationLabor).toBeCloseToCustomProjectOutput(
        expectedImplementationLabor,
      );
    });
    test('Blue carbon planning costs', async () => {
      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;
      const blueCarbonPlanning = yearlyBreakdown.find(
        (y) => y.costName === 'blueCarbonProjectPlanning',
      );
      const expectedBlueCarbonPlanning =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'blueCarbonProjectPlanning',
        );
      expect(blueCarbonPlanning).toBeCloseToCustomProjectOutput(
        expectedBlueCarbonPlanning,
      );
    });
    test('Community representation costs', async () => {
      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;
      const communityRepresentation = yearlyBreakdown.find(
        (y) => y.costName === 'communityRepresentation',
      );
      const expectedCommunityRepresentation =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'communityRepresentation',
        );
      expect(communityRepresentation).toBeCloseToCustomProjectOutput(
        expectedCommunityRepresentation,
      );
    });
    test('Community benefit sharing costs, estimated revenue costs, credits issued plan', async () => {
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
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'estimatedRevenuePlan',
        );
      const expectedCreditsIssuedPlan =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'creditsIssuedPlan',
        );
      const expectedCommunityBenefitSharing =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
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
    test('Carbon standard fees, opex total cost plan, total cost plan', async () => {
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
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'totalCostPlan',
        );
      const expectedOpexTotalCostPlan =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'opexTotalCostPlan',
        );
      const expectedCarbonStandardFees =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
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
    test('Annual net cash flow, annual net income', async () => {
      const yearlyBreakdown =
        customProjectOutput.initialCarbonPriceComputationOutput.yearlyBreakdown;
      const annualNetCashFlow = yearlyBreakdown.find(
        (y) => y.costName === 'annualNetCashFlow',
      );
      const expectedAnnualNetCashFlow =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
          (y) => y.costName === 'annualNetCashFlow',
        );
      const annualNetIncome = yearlyBreakdown.find(
        (y) => y.costName === 'annualNetIncome',
      );
      const expectedAnnualNetIncome =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput.initialCarbonPriceComputationOutput.yearlyBreakdown.find(
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

  describe('Breakeven price', () => {
    test('Breakeven price', async () => {
      const { breakevenPriceComputationOutput } = customProjectOutput;
      const expectedBreakevenPrice =
        CONSERVATION_MANGROVE_INDONESIA.expectedOutput
          .breakevenPriceComputationOutput;
      expect(breakevenPriceComputationOutput).toBeCloseToCustomProjectOutput(
        expectedBreakevenPrice,
      );
    });
  });
});

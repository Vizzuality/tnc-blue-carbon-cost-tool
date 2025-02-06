import { TestManager } from '../../utils/test-manager';
import { CalculationEngine } from '@api/modules/calculations/calculation.engine';
import { CustomProjectsService } from '@api/modules/custom-projects/custom-projects.service';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { RESTORATION_MEXICO_MANGROVE_FIXTURES } from './fixtures/restoration-mexico-mangroves';
import { CustomProject } from '@shared/entities/custom-project.entity';

// Utilitary function to round all numeric values as the API returns them as floats but in the expected output they are integers
function roundAllNumericValues(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (typeof v === 'number' ? Math.round(v) : v)),
  );
}

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
  test('Should compute the restoration costs for a given custom restoration project', async () => {
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

      expect(roundAllNumericValues(maintenance)).toEqual(
        roundAllNumericValues(expectedMaintenance),
      );
      expect(roundAllNumericValues(baselineReassesmentFrecuency)).toEqual(
        roundAllNumericValues(expectedBaselineReassesmentFrecuency),
      );
      expect(roundAllNumericValues(implementationLabor)).toEqual(
        roundAllNumericValues(expectedImplementationLabor),
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

      expect(roundAllNumericValues(blueCarbonPlanning)).toEqual(
        roundAllNumericValues(expectedBlueCarbonPlanning),
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

      expect(roundAllNumericValues(communityRepresentation)).toEqual(
        roundAllNumericValues(expectedCommunityRepresentation),
      );
    });
  });
});

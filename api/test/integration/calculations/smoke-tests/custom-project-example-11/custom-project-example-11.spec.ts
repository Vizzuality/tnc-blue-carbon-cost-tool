import { TestManager } from '../../../../utils/test-manager';
import { customProjectContract } from '@shared/contracts/custom-projects.contract';
import { CustomProject } from '@shared/entities/custom-project.entity';
import { CustomProjectOutput } from '@shared/dtos/custom-projects/custom-project-output.dto';
import { expectedOutput } from './expected-output';
import { inputDto } from './input-dto';
import '../../../../custom-matchers';
import { promises as fs } from 'fs';

// Maps the summary keys from the API to the expected keys from the prototype
export const summaryToExpectedKeyMap = {
  '$/tCO2e (total cost, NPV)': '$/tCO2e (total cost, NPV)',
  '$/ha': '$/ha',
  'IRR when priced to cover OpEx': 'IRR when priced to cover OpEx',
  'IRR when priced to cover total cost': 'IRR when priced to cover total cost',
  'Total cost (NPV)': 'Total cost (NPV)',
  'Capital expenditure (NPV)': 'Capital expenditure (NPV)',
  'Operating expenditure (NPV)': 'Operating expenditure (NPV)',
  'Credits issued': 'Credits issued',
  'Total revenue (NPV)': 'Total revenue (NPV)',
  'Total revenue (non-discounted)': 'Total revenue (non-discounted)',
  'Financing cost': 'Financing cost',
  'Funding gap (NPV)': 'Funding gap (NPV)',
  'Funding gap per tCO2e (NPV)': 'Funding gap per tCO2e (NPV)',
  'Landowner/community benefit share': 'Community benefit sharing fund',
  'Net revenue after OPEX': 'NPV covering cost',
  // "Leftover after OpEx / total cost": "NPV covering cost"
};

describe('custom-project-example-11', () => {
  let testManager: TestManager;
  let initialCarbonPrice: CustomProjectOutput['initialCarbonPriceComputationOutput'];
  let breakEvenPrice: CustomProjectOutput['breakevenPriceComputationOutput'];
  const expectedInitialCarbonPrice: CustomProjectOutput['initialCarbonPriceComputationOutput'] =
    expectedOutput.initialCarbonPriceComputationOutput as any;
  const expectedBreakEvenPrice: CustomProjectOutput['breakevenPriceComputationOutput'] =
    expectedOutput.breakevenPriceComputationOutput as any;

  beforeAll(async () => {
    testManager = await TestManager.createTestManager();
    const { jwtToken } = await testManager.setUpTestUser();
    await testManager.ingestCountries();
    await testManager.ingestProjectScoreCards(jwtToken);
    await testManager.ingestExcel(jwtToken);
    const response = await testManager
      .request()
      .post(customProjectContract.createCustomProject.path)
      .send(inputDto);

    fs.writeFile(
      `${__dirname}/output.json`,
      JSON.stringify(response.body.data, null, 2),
    );
    const { output } = response.body.data as CustomProject;
    initialCarbonPrice = output.initialCarbonPriceComputationOutput;
    breakEvenPrice = output.breakevenPriceComputationOutput;
  });

  afterAll(async () => {
    await testManager.clearDatabase();
    await testManager.close();
  });

  describe('Initial Carbon Price Computation', () => {
    test('Should match totalProjectCost', async () => {
      const { totalProjectCost } = initialCarbonPrice;
      expect(totalProjectCost).toBeCloseToCustomProjectOutput(
        expectedInitialCarbonPrice.totalProjectCost,
      );
    });
    test('Should match costDetails', async () => {
      const { costDetails } = initialCarbonPrice;
      expect(costDetails).toBeCloseToCustomProjectOutput(
        expectedInitialCarbonPrice.costDetails,
      );
    });
    test('Should match cost yearly breakdown', async () => {
      const { yearlyBreakdown } = initialCarbonPrice;
      expect(yearlyBreakdown).toBeCloseToCustomProjectOutput(
        expectedInitialCarbonPrice.yearlyBreakdown,
      );
    });
    test('Should match summary', async () => {
      // Summary keys returned by the API and the expected summary keys from the prototype are not the same
      const { summary } = initialCarbonPrice;
      const { summary: expectedSummary } = expectedInitialCarbonPrice;
      for (const actualKey in summaryToExpectedKeyMap) {
        const expectedKey = summaryToExpectedKeyMap[actualKey];
        const actualValue = summary[actualKey];
        if (!expectedSummary[expectedKey] === undefined) {
          const expectedValue = expectedSummary[expectedKey];
          expect(actualValue).toBeCloseTo(expectedValue, 0);
        }
      }
    });
  });

  describe('Break Even Price Computation', () => {
    test('Should match totalProjectCost', async () => {
      const { totalProjectCost } = breakEvenPrice;
      expect(totalProjectCost).toBeCloseToCustomProjectOutput(
        expectedBreakEvenPrice.totalProjectCost,
      );
    });
    test('Should match costDetails', async () => {
      const { costDetails } = breakEvenPrice;
      expect(costDetails).toBeCloseToCustomProjectOutput(
        expectedBreakEvenPrice.costDetails,
      );
    });
    test('Should match cost yearly breakdown', async () => {
      const { yearlyBreakdown } = breakEvenPrice;
      expect(yearlyBreakdown).toBeCloseToCustomProjectOutput(
        expectedBreakEvenPrice.yearlyBreakdown,
      );
    });
    test('Should match summary', async () => {
      // Summary keys returned by the API and the expected summary keys from the prototype are not the same
      const { summary } = breakEvenPrice;
      const { summary: expectedSummary } = breakEvenPrice;
      for (const actualKey in summaryToExpectedKeyMap) {
        const expectedKey = summaryToExpectedKeyMap[actualKey];
        const actualValue = summary[actualKey];
        if (!expectedSummary[expectedKey] === undefined) {
          const expectedValue = expectedSummary[expectedKey];
          expect(actualValue).toBeCloseTo(expectedValue, 0);
        }
      }
    });
  });
});

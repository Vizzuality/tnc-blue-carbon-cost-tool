import { SensitivityAnalyzer } from '@api/modules/calculations/calculators/sensitivity-analyzer.calculator';
import {
  COST_KEYS,
  SensitivityAnalysisResults,
} from '@api/modules/calculations/types';
import { SENSITIVITY_ANALYSIS_INPUT_FIXTURES } from './fixtures';
import { loadFixtures } from './fixtures/index';

const FIXTURE_CASES = loadFixtures();

describe('SensitivityAnalyzer', () => {
  test('should return a numeric result for every COST_KEY in a specific shape', () => {
    const analyzer = new SensitivityAnalyzer(
      SENSITIVITY_ANALYSIS_INPUT_FIXTURES,
    );

    const results = analyzer.run();
    const keys = Object.values(COST_KEYS);

    expect(results).toBeDefined();

    for (const key of keys) {
      const entry = results[key];
      expect(entry).toBeDefined();
      expect(entry).toEqual({
        decreased25: expect.any(Number),
        increased25: expect.any(Number),
        baseValue: expect.any(Number),
        changePctLower: expect.any(Number),
        changePctHigher: expect.any(Number),
      });
    }
  });

  test('should calculate change percentages correctly', () => {
    const baseValue =
      SENSITIVITY_ANALYSIS_INPUT_FIXTURES.initialCostPlanOutput.costPerTCO2e;
    const analyzer = new SensitivityAnalyzer(
      SENSITIVITY_ANALYSIS_INPUT_FIXTURES,
    );

    const results: SensitivityAnalysisResults = analyzer.run();

    for (const key of Object.values(COST_KEYS)) {
      const { decreased25, increased25, changePctLower, changePctHigher } =
        results[key];

      // Round to avoid floating point precision issues
      const lowerDiff = parseFloat(
        ((decreased25 - baseValue) / baseValue).toFixed(6),
      );
      const higherDiff = parseFloat(
        ((increased25 - baseValue) / baseValue).toFixed(6),
      );

      expect(changePctLower).toBeCloseTo(lowerDiff, 6);
      expect(changePctHigher).toBeCloseTo(higherDiff, 6);
    }
  });

  for (const fixture of FIXTURE_CASES) {
    const { name, data } = fixture;
    describe(`Fixture: ${name}`, () => {
      test("should calculate change percentages correctly (science people's inputs and expectations)", () => {
        // I don't like overusing constructor params as makes the code less flexible for future changes/tests
        const analyzer = new SensitivityAnalyzer();
        const results: SensitivityAnalysisResults = analyzer.run();
      });
    });
  }
});

import { SensitivityAnalyzer } from '@api/modules/calculations/calculators/sensitivity-analyzer.calculator';
import {
  COST_KEYS,
  SensitivityAnalysisResults,
} from '@api/modules/calculations/types';
import { SENSITIVITY_ANALYSIS_INPUT_FIXTURES } from './fixtures';

describe('SensitivityAnalyzer', () => {
  let baseValue: number;
  let analyzer: SensitivityAnalyzer;

  beforeEach(() => {
    baseValue =
      SENSITIVITY_ANALYSIS_INPUT_FIXTURES.initialCostPlanOutput.costPerTCO2e;
    analyzer = new SensitivityAnalyzer(SENSITIVITY_ANALYSIS_INPUT_FIXTURES);
  });

  test('should return a numeric result for every COST_KEY in a specific shape', () => {
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
});

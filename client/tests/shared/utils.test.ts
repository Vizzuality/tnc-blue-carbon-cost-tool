import {
  applyUserAssumptionsOverDefaults,
  applyUserCostInputsOverDefaults,
  getRestorationYearlyBreakdown,
  assumptionsArrayToMap,
} from "@shared/lib/transform-create-custom-project-payload";

describe("shared/lib/utils", () => {
  describe("transformAssumptionsData", () => {
    const mockAssumptions = {
      valid: [
        { name: "Baseline reassessment frequency", value: "5" },
        { name: "Buffer", value: "0.2" },
        { name: "Carbon price increase", value: "0.03" },
      ],
      invalid: [
        { name: "Invalid name", value: "10" },
        { name: "Buffer", value: undefined },
      ],
    } as const;

    it("should return empty object for empty input", () => {
      const result = assumptionsArrayToMap([]);
      expect(result).toEqual({});
    });

    it("should transform valid assumptions to correct format", () => {
      const result = assumptionsArrayToMap([...mockAssumptions.valid]);

      expect(result).toEqual({
        baselineReassessmentFrequency: 5,
        buffer: 0.2,
        carbonPriceIncrease: 0.03,
      });
    });

    it("should ignore invalid assumption names and undefined values", () => {
      const result = assumptionsArrayToMap([
        ...mockAssumptions.valid,
        ...mockAssumptions.invalid,
      ]);

      expect(result).toEqual({
        baselineReassessmentFrequency: 5,
        buffer: 0.2,
        carbonPriceIncrease: 0.03,
      });
      expect(result).not.toHaveProperty("Invalid name");
    });
  });

  describe("applyUserValuesOverDefaults", () => {
    const fixtures = {
      assumptions: {
        defaults: {
          buffer: 0.2,
          verificationFrequency: 2,
        },
        userValues: {
          buffer: 0.25,
          verificationFrequency: 3,
        },
        withUndefined: {
          buffer: undefined,
          verificationFrequency: 3,
        },
      },
      costs: {
        defaults: {
          validation: 1000,
          feasibilityAnalysis: 2000,
        },
        userValues: {
          validation: 1200,
        },
        withUndefined: {
          validation: undefined,
        },
      },
    } as const;

    it("should return empty object for empty inputs", () => {
      expect(applyUserAssumptionsOverDefaults({}, {})).toEqual({});
      expect(applyUserCostInputsOverDefaults({}, {})).toEqual({});
    });

    it("should prioritize user values over defaults", () => {
      const assumptionsResult = applyUserAssumptionsOverDefaults(
        fixtures.assumptions.defaults,
        fixtures.assumptions.userValues,
      );
      expect(assumptionsResult).toEqual({
        buffer: 0.25,
        verificationFrequency: 3,
      });

      const costsResult = applyUserCostInputsOverDefaults(
        fixtures.costs.defaults,
        fixtures.costs.userValues,
      );
      expect(costsResult).toEqual({
        validation: 1200,
      });
    });

    it("should handle undefined values by using defaults", () => {
      const assumptionsResult = applyUserAssumptionsOverDefaults(
        fixtures.assumptions.defaults,
        fixtures.assumptions.withUndefined,
      );
      expect(assumptionsResult).toEqual({
        buffer: 0.2,
        verificationFrequency: 3,
      });

      const costsResult = applyUserCostInputsOverDefaults(
        fixtures.costs.defaults,
        fixtures.costs.withUndefined,
      );
      expect(costsResult).toEqual({
        validation: 1000,
      });
    });
  });

  describe("getRestorationYearlyBreakdown", () => {
    const fixtures = {
      mixedData: [100, 200, 300, 0, 500],
      zeroData: [0, 0, 300, 0, 0],
      allZeros: [0, 0, 0],
    } as const;

    it("should return empty array for empty input", () => {
      const result = getRestorationYearlyBreakdown([]);
      expect(result).toEqual([]);
    });

    it("should transform yearly breakdown with mixed values correctly", () => {
      const result = getRestorationYearlyBreakdown([...fixtures.mixedData]);

      expect(result).toEqual([
        { year: -1, annualHectaresRestored: 100 },
        { year: 1, annualHectaresRestored: 200 },
        { year: 2, annualHectaresRestored: 300 },
        { year: 4, annualHectaresRestored: 500 },
      ]);
    });

    it("should filter out zero values", () => {
      const result = getRestorationYearlyBreakdown([...fixtures.zeroData]);

      expect(result).toEqual([{ year: 2, annualHectaresRestored: 300 }]);
    });

    it("should handle all zero values", () => {
      const result = getRestorationYearlyBreakdown([...fixtures.allZeros]);

      expect(result).toEqual([]);
    });
  });
});

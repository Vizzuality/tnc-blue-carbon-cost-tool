import {
  applyUserAssumptionsOverDefaults,
  applyUserCostInputsOverDefaults,
  getRestorationYearlyBreakdown,
  transformAssumptionsData,
} from "@shared/lib/utils";
import { ValidatedCustomProjectForm } from "@shared/schemas/custom-projects/create-custom-project.schema";

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
      const result = transformAssumptionsData([]);
      expect(result).toEqual({});
    });

    it("should transform valid assumptions to correct format", () => {
      const result = transformAssumptionsData([...mockAssumptions.valid]);

      expect(result).toEqual({
        baselineReassessmentFrequency: 5,
        buffer: 0.2,
        carbonPriceIncrease: 0.03,
      });
    });

    it("should ignore invalid assumption names and undefined values", () => {
      const result = transformAssumptionsData([
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

  describe("applyUserAssumptionsOverDefaults", () => {
    const fixtures = {
      defaultAssumptions: {
        buffer: 0.2,
        verificationFrequency: 2,
      } as const,
      userAssumptions: {
        valid: {
          buffer: 0.25,
          verificationFrequency: 3,
        },
        withUndefined: {
          buffer: undefined,
          verificationFrequency: 3,
        },
      } as const,
    };

    it("should return empty object for empty inputs", () => {
      const result = applyUserAssumptionsOverDefaults({}, {});
      expect(result).toEqual({});
    });

    it("should prioritize user assumptions over defaults", () => {
      const result = applyUserAssumptionsOverDefaults(
        fixtures.defaultAssumptions,
        fixtures.userAssumptions.valid,
      );

      expect(result).toEqual({
        buffer: 0.25,
        verificationFrequency: 3,
      });
    });

    it("should handle undefined values", () => {
      const result = applyUserAssumptionsOverDefaults(
        fixtures.defaultAssumptions,
        fixtures.userAssumptions.withUndefined,
      );

      expect(result).toEqual({
        buffer: 0.2,
        verificationFrequency: 3,
      });
    });
  });

  describe("applyUserCostInputsOverDefaults", () => {
    const defaultCostInputs: Partial<ValidatedCustomProjectForm["costInputs"]> =
      {
        validation: 1000,
        feasibilityAnalysis: 2000,
        monitoring: 3000,
      };

    it("handles empty data", () => {
      const result = applyUserCostInputsOverDefaults(defaultCostInputs, {});
      expect(result).toEqual({});
    });

    it("prioritizes user cost inputs over defaults", () => {
      const userCostInputs: Partial<ValidatedCustomProjectForm["costInputs"]> =
        {
          validation: 1200,
        };

      const result = applyUserCostInputsOverDefaults(
        defaultCostInputs,
        userCostInputs,
      );

      expect(result).toEqual({
        validation: 1200,
      });
    });

    it("handles undefined values", () => {
      const userCostInputs: Partial<ValidatedCustomProjectForm["costInputs"]> =
        {
          validation: undefined,
        };

      const result = applyUserCostInputsOverDefaults(
        defaultCostInputs,
        userCostInputs,
      );

      expect(result).toEqual({
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

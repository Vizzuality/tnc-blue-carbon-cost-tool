import { MAX_PROJECT_LENGTH } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { getRestorationPlanTableData } from "@/containers/projects/form/utils";

describe("projects/form/utils", () => {
  describe("getRestorationPlanTableData", () => {
    const projectLength = 2;
    // this array is used to test the actual output
    // it is based on  a project length of 2 years, which makes the total length 2 + 1 (for the year -1)
    const baseTestData = [
      { year: -1, annualHectaresRestored: 0 },
      { year: 1, annualHectaresRestored: 0 },
      { year: 2, annualHectaresRestored: 0 },
    ];

    describe("basic functionality", () => {
      it("should return an empty array if no lengths are specified", () => {
        expect(getRestorationPlanTableData()).toEqual([]);
      });

      it("should use defaultLength when projectLength is not specified", () => {
        expect(getRestorationPlanTableData(undefined, projectLength)).toEqual(
          baseTestData,
        );
      });

      it("should use projectLength when specified", () => {
        expect(getRestorationPlanTableData(projectLength)).toEqual(
          baseTestData,
        );
      });

      it("should prioritize projectLength over defaultLength", () => {
        expect(getRestorationPlanTableData(projectLength, 3)).toEqual(
          baseTestData,
        );
      });
    });

    describe("maxProjectLength handling", () => {
      const customMaxLength = 10;

      it("should respect MAX_PROJECT_LENGTH constant", () => {
        const result = getRestorationPlanTableData(MAX_PROJECT_LENGTH);
        expect(result).toHaveLength(MAX_PROJECT_LENGTH + 1);
      });

      it.each<[string, number | undefined, number, number | undefined]>([
        ["less than max", 5, 6, undefined],
        ["equal to max", customMaxLength, customMaxLength + 1, undefined],
        ["exceeding max", 15, 0, undefined],
        ["with defaultLength", undefined, 9, 8],
      ])(
        "should handle when projectLength is %s",
        (_, length, expected, defaultLength) => {
          const result = getRestorationPlanTableData(
            length,
            defaultLength,
            customMaxLength,
          );
          expect(result).toHaveLength(expected);
        },
      );
    });

    describe("invalid inputs", () => {
      it.each([
        ["zero", 0],
        ["negative", -1],
        ["undefined", undefined],
        ["null", null],
      ])("should ignore invalid maxProjectLength: %s", (_, maxLength) => {
        const result = getRestorationPlanTableData(
          5,
          undefined,
          maxLength as number,
        );
        expect(result).toHaveLength(6);
      });

      it.each([
        ["zero", 0],
        ["negative", -1],
        ["large negative", -1000],
        ["exceeding maximum", MAX_PROJECT_LENGTH + 1],
        ["far exceeding maximum", MAX_PROJECT_LENGTH + 1000],
      ])(
        "should return empty array for invalid projectLength: %s",
        (_, length) => {
          expect(getRestorationPlanTableData(length)).toHaveLength(0);
        },
      );
    });
  });
});

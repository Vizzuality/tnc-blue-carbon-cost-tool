import { MAX_PROJECT_LENGTH } from "@shared/schemas/custom-projects/create-custom-project.schema";

import { getRestorationPlanTableData } from "@/containers/projects/form/utils";

describe("projects/form/utils", () => {
  // this array is used to test the actual output
  // it is based on  a project length of 2 years, which makes the total length 2 + 1 (for the year -1)
  const RESTORATION_PLAN_DATA = [
    { year: -1, annualHectaresRestored: 0 },
    { year: 1, annualHectaresRestored: 0 },
    { year: 2, annualHectaresRestored: 0 },
  ];
  const projectLength = 2;

  describe("getRestorationPlanTableData", () => {
    it("should return an empty array if projectLength and defaultLength are not specified", () => {
      const result = getRestorationPlanTableData();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should use the defaultLength if projectLength is not specified and defaultLength is provided", () => {
      const result = getRestorationPlanTableData(undefined, projectLength);
      expect(result).toEqual(RESTORATION_PLAN_DATA);
      expect(result).toHaveLength(RESTORATION_PLAN_DATA.length);
    });

    it("should use projectLength when it is specified", () => {
      const result = getRestorationPlanTableData(projectLength);
      expect(result).toEqual(RESTORATION_PLAN_DATA);
      expect(result).toHaveLength(RESTORATION_PLAN_DATA.length);
    });

    it("should prioritize projectLength over defaultLength when both are provided", () => {
      const defaultLength = 3;
      const result = getRestorationPlanTableData(projectLength, defaultLength);
      expect(result).toEqual(RESTORATION_PLAN_DATA);
      expect(result).toHaveLength(RESTORATION_PLAN_DATA.length);
    });

    test.each([
      ["zero", 0],
      ["negative", -1],
      ["large negative", -1000],
      ["exceeding maximum", MAX_PROJECT_LENGTH + 1],
      ["far exceeding maximum", MAX_PROJECT_LENGTH + 1000],
    ])("should return an empty array when projectLength is %s", (_, length) => {
      const result = getRestorationPlanTableData(length);
      expect(result).toHaveLength(0);
    });
  });
});

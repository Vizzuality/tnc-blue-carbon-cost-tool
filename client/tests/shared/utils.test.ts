import {
  getOpexCostInputsKeys,
  getCapexCostInputsKeys,
} from "@shared/lib/utils";
import { COST_INPUTS_KEYS } from "@shared/dtos/custom-projects/custom-projects.constants";

describe("shared/lib/utils", () => {
  describe("getCapexCostInputsKeys and getOpexCostInputsKeys", () => {
    const fixtures = {
      data: {
        [COST_INPUTS_KEYS.capex[0]]: 1000,
        [COST_INPUTS_KEYS.capex[1]]: 2000,
        [COST_INPUTS_KEYS.opex[0]]: 500,
        [COST_INPUTS_KEYS.opex[1]]: 300,
      },
      empty: {},
    } as const;

    describe("getCapexCostInputsKeys", () => {
      it("should return empty array for empty input", () => {
        const result = getCapexCostInputsKeys(fixtures.empty);
        expect(result).toEqual([]);
      });

      it("should return only capex keys", () => {
        const result = getCapexCostInputsKeys(fixtures.data);
        expect(result).toEqual([
          COST_INPUTS_KEYS.capex[0],
          COST_INPUTS_KEYS.capex[1],
        ]);
      });
    });

    describe("getOpexCostInputsKeys", () => {
      it("should return empty array for empty input", () => {
        const result = getOpexCostInputsKeys(fixtures.empty);
        expect(result).toEqual([]);
      });

      it("should return only opex keys", () => {
        const result = getOpexCostInputsKeys(fixtures.data);
        expect(result).toEqual([
          COST_INPUTS_KEYS.opex[0],
          COST_INPUTS_KEYS.opex[1],
        ]);
      });
    });
  });
});

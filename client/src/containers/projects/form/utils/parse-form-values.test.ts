import { describe, expect, it, vi } from "vitest";
import * as cart from "./parse-form-values";
import { parseFormValues } from "./parse-form-values"; // const mocks = vi.hoisted(() => {
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { ACTIVITY } from "@shared/entities/activity.enum";
import { z } from "zod";
import {
  AssumptionsSchema,
  CustomProjectForm,
} from "@shared/schemas/custom-projects/create-custom-project.schema";

// const mocks = vi.hoisted(() => {
//   return {
//     getDefaultAssumptions: vi.fn().mockReturnValueOnce({
//       baselineReassessmentFrequency: 666,
//     }),
//   };
// });
//
// vi.mock("./parse-form-values.ts", () => {
//   return {
//     parseFormValues: vi.fn(),
//     getDefaultAssumptions: vi.fn().mockReturnValueOnce({
//       baselineReassessmentFrequency: 666,
//     }),
//   };
// });

describe("parseFormValues", () => {
  it("should parse form values with default assumptions and cost inputs", () => {
    const assumptionsMock: z.infer<typeof AssumptionsSchema> = {
      baselineReassessmentFrequency: 10,
      buffer: 0.2,
      carbonPriceIncrease: 30,
      discountRate: 0.04,
      verificationFrequency: 5,
      projectLength: 500,
    };

    const spy = vi
      .spyOn(cart, "getDefaultAssumptions")
      .mockReturnValue(assumptionsMock);

    // expect(
    //   cart.getDefaultAssumptions(ECOSYSTEM.MANGROVE, ACTIVITY.RESTORATION),
    // ).toStrictEqual(assumptionsMock);

    // expect(spy).toHaveBeenCalledWith(ECOSYSTEM.MANGROVE, ACTIVITY.RESTORATION);
    //
    // expect(spy).toHaveBeenCalledTimes(1);

    // expect(
    //   getDefaultAssumptions(ECOSYSTEM.MANGROVE, ACTIVITY.RESTORATION),
    // ).toStrictEqual({
    //   baselineReassessmentFrequency: 666,
    // });

    const input: CustomProjectForm = {
      ecosystem: ECOSYSTEM.MANGROVE,
      activity: ACTIVITY.RESTORATION,
      countryCode: "US",
      parameters: { plantingSuccessRate: 80 },
      assumptions: { discountRate: 5 },
      costInputs: { validation: 50 },
    };

    const result = cart.parseFormValues(input);

    expect(result).toStrictEqual(assumptionsMock);

    //
    // expect(result).toEqual({
    //   ...input,
    //   parameters: {
    //     ...input.parameters,
    //     plantingSuccessRate: 80,
    //   },
    //   assumptions: {
    //     baselineReassessmentFrequency: 0,
    //     buffer: 10,
    //     carbonPriceIncrease: 0,
    //     discountRate: 5,
    //     verificationFrequency: 0,
    //     projectLength: 0,
    //   },
    //   costInputs: {
    //     validation: 50,
    //     feasibilityAnalysis: 0,
    //     conservationPlanningAndAdmin: 0,
    //     dataCollectionAndFieldCost: 0,
    //     communityRepresentation: 0,
    //     blueCarbonProjectPlanning: 0,
    //     establishingCarbonRights: 0,
    //     maintenance: 0,
    //     monitoring: 0,
    //     communityBenefitSharingFund: 0,
    //     financingCost: 0,
    //     carbonStandardFees: 0,
    //     baselineReassessment: 0,
    //     mrv: 0,
    //     longTermProjectOperatingCost: 0,
    //     implementationLabor: 0,
    //   },
    // });
  });
});

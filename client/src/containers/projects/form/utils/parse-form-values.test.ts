import { ACTIVITY } from "@shared/entities/activity.enum";
import { EMISSION_FACTORS_TIER_TYPES } from "@shared/entities/carbon-inputs/emission-factors.entity";
import {
  CARBON_REVENUES_TO_COVER,
  PROJECT_SPECIFIC_EMISSION,
} from "@shared/entities/custom-project.entity";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import { applyUserValuesOverDefaults } from "@shared/lib/transform-create-custom-project-payload";
import {
  AssumptionsSchema,
  CustomProjectBaseSchema,
  CustomProjectForm,
  LOSS_RATE_USED,
} from "@shared/schemas/custom-projects/create-custom-project.schema";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import mockedImport, { parseFormValues } from "./parse-form-values";

describe("parse form values - helpers", () => {
  it("overrides assumptions successfully", () => {
    vi.spyOn(mockedImport, "getDefaultAssumptions").mockReturnValueOnce({
      verificationFrequency: 5,
      baselineReassessmentFrequency: 10,
      discountRate: 0.04,
      carbonPriceIncrease: 0.015,
      buffer: 0.2,
      projectLength: 20,
    });

    const userAssumptions: Partial<
      z.infer<typeof CustomProjectBaseSchema>["assumptions"]
    > = {
      carbonPriceIncrease: 0.02,
      buffer: 0.3,
      projectLength: 30,
    };

    const defaultAssumptions = mockedImport.getDefaultAssumptions(
      ECOSYSTEM.MANGROVE,
      ACTIVITY.RESTORATION,
    );

    const finalAssumptions = applyUserValuesOverDefaults(
      defaultAssumptions,
      userAssumptions,
    );

    expect(finalAssumptions).toStrictEqual({
      verificationFrequency: 5,
      baselineReassessmentFrequency: 10,
      discountRate: 0.04,
      carbonPriceIncrease: 0.02,
      buffer: 0.3,
      projectLength: 30,
    });
  });

  it("overrides cost inputs successfully", () => {
    vi.spyOn(mockedImport, "getDefaultCostInputs").mockReturnValueOnce({
      feasibilityAnalysis: 70000,
      conservationPlanningAndAdmin: 166766.666666667,
      dataCollectionAndFieldCost: 26666.6666666667,
      communityRepresentation: 113016.666666667,
      blueCarbonProjectPlanning: 115000,
      establishingCarbonRights: 120000,
      validation: 50000,
      monitoring: 40200,
      maintenance: 0.0833,
      communityBenefitSharingFund: 0.05,
      carbonStandardFees: 0.2,
      baselineReassessment: 40000,
      mrv: 100000,
      longTermProjectOperatingCost: 105800,
      financingCost: 0.05,
    });

    const userInputCosts: Partial<
      z.infer<typeof CustomProjectBaseSchema>["costInputs"]
    > = {
      baselineReassessment: 80000,
      mrv: 400000,
      financingCost: 0.25,
    };

    const userInput: CustomProjectForm = {
      countryCode: "AUS",
      projectName: "aus-test",
      ecosystem: ECOSYSTEM.SEAGRASS,
      activity: ACTIVITY.CONSERVATION,
      projectSizeHa: 10000,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPriceAssumption: 30,
      parameters: {
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
        projectSpecificLossRate: -0.001,
        projectSpecificEmissionFactor: 15,
        emissionFactorAGB: 200,
        emissionFactorSOC: 15,
      },
    };

    const defaultCostInputs = mockedImport.getDefaultCostInputs(userInput);

    const finalCostInputs = applyUserValuesOverDefaults(
      defaultCostInputs,
      userInputCosts,
    );

    expect(finalCostInputs).toStrictEqual({
      feasibilityAnalysis: 70000,
      conservationPlanningAndAdmin: 166766.666666667,
      dataCollectionAndFieldCost: 26666.6666666667,
      communityRepresentation: 113016.666666667,
      blueCarbonProjectPlanning: 115000,
      establishingCarbonRights: 120000,
      validation: 50000,
      monitoring: 40200,
      maintenance: 0.0833,
      communityBenefitSharingFund: 0.05,
      carbonStandardFees: 0.2,
      baselineReassessment: 80000,
      mrv: 400000,
      longTermProjectOperatingCost: 105800,
      financingCost: 0.25,
    });
  });

  it("should parse form values along with assumptions and cost inputs", () => {
    const userInput: CustomProjectForm = {
      countryCode: "AUS",
      projectName: "aus-test",
      ecosystem: ECOSYSTEM.SEAGRASS,
      activity: ACTIVITY.CONSERVATION,
      projectSizeHa: 10000,
      carbonRevenuesToCover: CARBON_REVENUES_TO_COVER.OPEX,
      initialCarbonPriceAssumption: 30,
      parameters: {
        lossRateUsed: LOSS_RATE_USED.PROJECT_SPECIFIC,
        emissionFactorUsed: EMISSION_FACTORS_TIER_TYPES.TIER_1,
        projectSpecificEmission: PROJECT_SPECIFIC_EMISSION.ONE_EMISSION_FACTOR,
        projectSpecificLossRate: -0.001,
        projectSpecificEmissionFactor: 15,
        emissionFactorAGB: 200,
        emissionFactorSOC: 15,
      },
    };

    const userAssumptions: z.infer<typeof AssumptionsSchema> = {
      verificationFrequency: 5,
      baselineReassessmentFrequency: 10,
      discountRate: 0.04,
      carbonPriceIncrease: 0.015,
      buffer: 0.2,
      projectLength: 20,
    };

    const userCostInputs: z.infer<
      typeof CustomProjectBaseSchema
    >["costInputs"] = {
      feasibilityAnalysis: 70000,
      conservationPlanningAndAdmin: 166766.666666667,
      dataCollectionAndFieldCost: 26666.6666666667,
      communityRepresentation: 113016.666666667,
      blueCarbonProjectPlanning: 115000,
      establishingCarbonRights: 120000,
      validation: 50000,
      monitoring: 40200,
      maintenance: 0.0833,
      communityBenefitSharingFund: 0.05,
      carbonStandardFees: 0.2,
      baselineReassessment: 40000,
      mrv: 100000,
      longTermProjectOperatingCost: 105800,
      financingCost: 0.05,
    };

    const result = parseFormValues(userInput, userAssumptions, userCostInputs);
    expect(result.costInputs).toStrictEqual(userCostInputs);
    expect(result.assumptions).toStrictEqual(userAssumptions);
  });
});

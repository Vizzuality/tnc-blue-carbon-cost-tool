// Default values to satisfy TypeScript requirements for form validation

import { ACTIVITY } from "@shared/entities/activity.enum";
import { ECOSYSTEM } from "@shared/entities/ecosystem.enum";
import {
  applyUserAssumptionsOverDefaults,
  applyUserCostInputsOverDefaults,
  assumptionsArrayToMap,
} from "@shared/lib/transform-create-custom-project-payload";
import {
  CustomProjectForm,
  ValidatedCustomProjectForm,
} from "@shared/schemas/custom-projects/create-custom-project.schema";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";

import { getQueryClient } from "@/app/providers";

// These will be overridden by actual values from the API or user input
const DEFAULT_COST_INPUTS = {
  validation: 0,
  feasibilityAnalysis: 0,
  conservationPlanningAndAdmin: 0,
  dataCollectionAndFieldCost: 0,
  communityRepresentation: 0,
  blueCarbonProjectPlanning: 0,
  establishingCarbonRights: 0,
  implementationLabor: 0,
  equipmentAndMaterials: 0,
  maintenance: 0,
  monitoring: 0,
  verification: 0,
  certification: 0,
  projectManagement: 0,
  communityBenefitSharingFund: 0,
  registryFees: 0,
  brokerage: 0,
  insuranceCost: 0,
  financingCost: 0,
  carbonStandardFees: 0,
  baselineReassessment: 0,
  mrv: 0,
  longTermProjectOperatingCost: 0,
} as const;

const DEFAULT_ASSUMPTIONS = {
  baselineReassessmentFrequency: 0,
  buffer: 0,
  carbonPriceIncrease: 0,
  discountRate: 0,
  verificationFrequency: 0,
  projectLength: 0,
} as const;

const getDefaultAssumptions = (ecosystem: ECOSYSTEM, activity: ACTIVITY) => {
  const queryClient = getQueryClient();

  const assumptionsData =
    client.customProjects.getDefaultAssumptions.getQueryData(
      queryClient,
      queryKeys.customProjects.assumptions({
        ecosystem: ecosystem,
        activity: activity,
      }).queryKey,
    )?.body.data;

  return assumptionsData ? assumptionsArrayToMap(assumptionsData) : {};
};

const getDefaultCostInputs = (data: CustomProjectForm) => {
  const { ecosystem, activity, countryCode } = data;
  const queryClient = getQueryClient();

  return client.customProjects.getDefaultCostInputs.getQueryData(
    queryClient,
    queryKeys.customProjects.defaultCosts({
      ecosystem: ecosystem,
      activity: activity,
      countryCode: countryCode,
      ...(activity === ACTIVITY.RESTORATION && {
        restorationActivity:
          "restorationActivity" in data.parameters
            ? data.parameters.restorationActivity
            : undefined,
      }),
    }).queryKey,
  )?.body.data;
};

const parseFormValues = (
  data: CustomProjectForm,
): ValidatedCustomProjectForm => {
  const originalValues = { ...data };
  const defaultAssumptions = getDefaultAssumptions(
    data.ecosystem,
    data.activity,
  );

  return {
    ...originalValues,
    parameters: {
      ...originalValues.parameters,
      // @ts-expect-error fix later
      ...(originalValues.parameters?.plantingSuccessRate && {
        plantingSuccessRate:
          // @ts-expect-error fix later
          originalValues.parameters.plantingSuccessRate,
      }),
    },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      ...applyUserAssumptionsOverDefaults(
        defaultAssumptions,
        originalValues.assumptions ?? {},
      ),
    },
    costInputs: {
      ...DEFAULT_COST_INPUTS,
      ...applyUserCostInputsOverDefaults(
        getDefaultCostInputs(data) ?? {},
        originalValues.costInputs ?? {},
      ),
    },
  };
};

export default parseFormValues;
